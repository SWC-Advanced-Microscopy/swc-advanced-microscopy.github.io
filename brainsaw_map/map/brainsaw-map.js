/* BrainSaw adopter map — proof of principle.
 *
 * No dependencies, no network calls beyond the two local JSON files. The
 * basemap comes from map/world.js, which holds Natural Earth country outlines
 * pre-projected into Web Mercator on a 0..WORLD_SIZE square.
 *
 * Data model: a *site* is a lab or facility at one location and may hold
 * several *systems*. Pins are per system; publications are per site, because
 * the people at a site use whichever of its systems is free.
 *
 * Usage:
 *     const map = await BrainSawMap.create();
 *     document.querySelector('#launch').onclick = () => map.open();
 */

const BrainSawMap = (() => {
  'use strict';

  const MAX_LAT = 85.05113;
  const CLUSTER_PX = 38;      // screen distance below which pins merge
  // Relative to the whole-world fit. This has to be deep enough for FAN_MAX_KM
  // below to be reachable even with the detail panel open, which narrows the
  // map and so lowers the whole-world fit. At 55 the 1:50m coastlines are out
  // by about five pixels at full zoom — visible if you go looking, and by then
  // the coast is usually off screen anyway. See tools/build_world.py.
  const MAX_ZOOM_FACTOR = 55;
  const PUBS_SHOWN = 6;       // before the "show all" link
  // A fan is laid out in screen pixels, so how much ground it covers depends
  // entirely on the zoom. Fanning six London systems while half of Europe is on
  // screen puts pins in Belgium. Before fanning, zoom in until the fan spans no
  // more than this many kilometres on the ground.
  const FAN_MAX_KM = 40;
  const EARTH_KM = 40075;

  /* ---- projection ------------------------------------------------------ */

  // Identical maths to tools/build_world.py, so pins land exactly on the coast.
  function project(lon, lat) {
    const clamped = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
    const s = Math.sin((clamped * Math.PI) / 180);
    return {
      x: ((lon + 180) / 360) * WORLD_SIZE,
      y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * WORLD_SIZE,
    };
  }

  /* ---- small helpers --------------------------------------------------- */

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const STATUS_VAR = {
    'in-use': '--bsm-in-use',
    building: '--bsm-building',
    planned: '--bsm-planned',
    paused: '--bsm-paused',
    eol: '--bsm-eol',
  };

  const glyph = (status) => {
    const g = el('span', 'bsm-glyph');
    g.dataset.status = status;
    return g;
  };

  // Natural Earth's country names differ from the ones we want to print.
  const NE_NAME = {
    'United States': 'United States of America',
    'Hong Kong SAR': 'Hong Kong',
  };

  /* ---- publications ---------------------------------------------------- */

  // `../assets/data/publications.json` is the schema the SWC publications page
  // will itself use, so it is read as-is and adapted here rather than being
  // reshaped by hand — the point of it is that nobody has to guess who did
  // what.  Two fields matter to the map:
  //
  //   equipment[]          — must contain "BrainSaw"; the file also covers
  //                          light-sheet, SP8 and TissueVision work.
  //   instrument_location  — where the imaging happened, which is NOT the
  //                          authors' institution.  Rancz was at the Crick;
  //                          which system he used is a separate question, and
  //                          this field is the one that answers it.
  const SITE_OF = {
    'AMF': 'swc',
    'EPFL': 'petersen',
    'Francis Crick Institute': 'crick',
    // "UCL" means UCL but not SWC — so RockSaw, the only other UCL system.
    // If a second one is ever built this stops being unambiguous, which is
    // why an unknown value shouts rather than being quietly dropped.
    'UCL': 'clark',
    'UCL, Clark': 'clark',
  };

  function adaptPublications(raw) {
    const out = [];
    for (const p of raw) {
      if (!(p.equipment || []).includes('BrainSaw')) continue;
      const site = SITE_OF[p.instrument_location];
      if (!site) {
        // Loud on purpose. A publication that silently vanishes is invisible:
        // nobody notices a count of 24 that should have been 25.
        console.error(
          `[brainsaw-map] unknown instrument_location ${JSON.stringify(p.instrument_location)} ` +
          `on "${p.id}" — add it to SITE_OF. This paper is missing from the map.`);
        continue;
      }
      out.push({ id: p.id, title: p.title, venue: p.journal, year: p.year, url: p.url, site });
    }
    return out;
  }

  /* ---- the applet ------------------------------------------------------ */

  class Map {
    constructor(data, pubs, base = '') {
      // Photo paths in sites.json are relative to this folder, not to whatever
      // page is hosting the applet, so they get the same prefix as the data.
      this.base = base;
      this.statusMeta = data.statuses;
      this.sites = data.sites;
      this.pubs = adaptPublications(pubs.publications);

      // One pin per system, but every system keeps a handle on its site.
      this.systems = [];
      for (const site of this.sites) {
        const p = project(site.lon, site.lat);
        site.x = p.x;
        site.y = p.y;
        for (const sys of site.systems) {
          this.systems.push({ ...sys, site, x: p.x, y: p.y });
        }
      }

      this.active = new Set(
        Object.keys(this.statusMeta).filter((k) => this.count(k) > 0));
      this.expanded = null;   // key of the fanned-out cluster
      this.selected = null;   // id of the system shown in the panel
      this.showAllPubs = false;
      this.view = { scale: 1, tx: 0, ty: 0 };
      this.build();
    }

    count(status) {
      return this.systems.filter((s) => s.status === status).length;
    }

    // Most systems have no name of their own, so they borrow the site's: the
    // full name reads as a heading, the short one fits beside a pin.
    title(sys) {
      return sys.name || sys.site.lab;
    }

    // Hong Kong is its own country, so "Hong Kong, Hong Kong" needs collapsing.
    place(site) {
      return site.city === site.country ? site.city : `${site.city}, ${site.country}`;
    }

    pinLabel(sys) {
      return sys.name || sys.site.short || sys.site.lab;
    }

    pubsFor(siteId) {
      return this.pubs
        .filter((p) => p.site === siteId)
        .sort((a, b) => b.year - a.year);
    }

    /* --- DOM ----------------------------------------------------------- */

    build() {
      const root = el('div', 'bsm-overlay');
      root.dataset.open = 'false';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Map of BrainSaw systems');
      root.innerHTML = `
        <div class="bsm-frame">
          <header class="bsm-bar">
            <button class="bsm-close" title="Close (Esc)" aria-label="Close map">&times;</button>
            <div class="bsm-titles">
              <div class="bsm-title">BrainSaw around the world</div>
              <div class="bsm-sub"></div>
            </div>
            <div class="bsm-filters"></div>
          </header>
          <div class="bsm-body">
            <div class="bsm-mapwrap">
              <svg class="bsm-map" preserveAspectRatio="none" aria-hidden="true"></svg>
              <svg class="bsm-legs" aria-hidden="true"></svg>
              <div class="bsm-pins"></div>
              <div class="bsm-tip" data-show="false"></div>
              <div class="bsm-scalenote">Drag to pan · scroll to zoom · click a cluster to open it</div>
              <div class="bsm-zoom">
                <button data-act="in" title="Zoom in" aria-label="Zoom in">+</button>
                <button data-act="out" title="Zoom out" aria-label="Zoom out">&minus;</button>
                <button data-act="home" title="Reset view" aria-label="Reset view">&#9678;</button>
              </div>
            </div>
            <aside class="bsm-panel" data-open="false" aria-live="polite"></aside>
          </div>
        </div>`;

      this.root = root;
      this.frame = root.querySelector('.bsm-frame');
      this.wrap = root.querySelector('.bsm-mapwrap');
      this.svg = root.querySelector('.bsm-map');
      this.legs = root.querySelector('.bsm-legs');
      this.pinLayer = root.querySelector('.bsm-pins');
      this.tip = root.querySelector('.bsm-tip');
      this.panel = root.querySelector('.bsm-panel');

      this.drawBasemap();
      this.buildFilters();
      this.summarise();
      this.wire();
      document.body.appendChild(root);
    }

    drawBasemap() {
      const withSystems = new Set(
        this.sites.map((s) => NE_NAME[s.country] || s.country));
      const ns = 'http://www.w3.org/2000/svg';
      const g = document.createElementNS(ns, 'g');
      for (const c of WORLD) {
        const p = document.createElementNS(ns, 'path');
        p.setAttribute('class', 'bsm-country');
        p.setAttribute('d', c.d);
        if (withSystems.has(c.name)) p.dataset.hasSystems = 'true';
        g.appendChild(p);
      }
      this.svg.appendChild(g);
    }

    // The chips are the legend as well as the filter, so statuses nobody has
    // are left out rather than shown as a permanent zero.
    buildFilters() {
      const box = this.root.querySelector('.bsm-filters');
      for (const [key, meta] of Object.entries(this.statusMeta)) {
        const n = this.count(key);
        if (!n) continue;
        const chip = el('button', 'bsm-chip');
        chip.type = 'button';
        chip.dataset.status = key;
        chip.setAttribute('aria-pressed', 'true');
        chip.title = meta.blurb;
        chip.append(glyph(key), el('span', null, meta.label), el('b', null, String(n)));
        chip.addEventListener('click', () => {
          if (this.active.has(key)) this.active.delete(key);
          else this.active.add(key);
          chip.setAttribute('aria-pressed', String(this.active.has(key)));
          this.expanded = null;
          this.render();
        });
        box.appendChild(chip);
      }
    }

    summarise() {
      const countries = new Set(this.sites.map((s) => s.country));
      this.root.querySelector('.bsm-sub').textContent =
        `${this.systems.length} systems · ${this.sites.length} sites · ${countries.size} countries`;
    }

    /* --- view maths ----------------------------------------------------- */

    get size() {
      return { w: this.wrap.clientWidth, h: this.wrap.clientHeight };
    }

    get minScale() {
      const { w, h } = this.size;
      return Math.max(w, h) / WORLD_SIZE;
    }

    toScreen(p) {
      return { x: p.x * this.view.scale + this.view.tx, y: p.y * this.view.scale + this.view.ty };
    }

    // Frame the systems rather than the whole globe: the empty Pacific adds
    // nothing, and this way Europe is legible the moment the map opens.
    home() {
      const { w, h } = this.size;
      const xs = this.systems.map((s) => s.x);
      const ys = this.systems.map((s) => s.y);
      // Margin in world units (1 unit ≈ 0.36° of longitude). Enough to keep the
      // outermost pins clear of the frame without stranding Europe in a corner
      // of an otherwise empty hemisphere.
      const pad = 45;
      const bw = Math.max(...xs) - Math.min(...xs) + pad * 2;
      const bh = Math.max(...ys) - Math.min(...ys) + pad * 2;
      const scale = Math.max(this.minScale, Math.min(w / bw, h / bh));
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
      const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
      this.setView(scale, w / 2 - cx * scale, h / 2 - cy * scale);
    }

    setView(scale, tx, ty) {
      const { w, h } = this.size;
      if (!w || !h) return;
      if (![scale, tx, ty].every(Number.isFinite)) return;

      // The world point the caller wanted in the middle of the map. Clamping
      // the scale has to pivot about this, not about the origin: deep in, tx is
      // tens of thousands of pixels, so rescaling about the corner throws the
      // view a whole continent sideways. That is what used to happen the first
      // time the detail panel opened — the narrower map lowers the zoom
      // ceiling, the scale got clamped, and London slid off to eastern France.
      const cx = (w / 2 - tx) / scale;
      const cy = (h / 2 - ty) / scale;

      const min = this.minScale;
      scale = Math.max(min, Math.min(min * MAX_ZOOM_FACTOR, scale));
      tx = w / 2 - cx * scale;
      ty = h / 2 - cy * scale;

      // Keep the world covering the viewport rather than drifting into space.
      const worldPx = WORLD_SIZE * scale;
      tx = worldPx <= w ? (w - worldPx) / 2 : Math.min(0, Math.max(w - worldPx, tx));
      ty = worldPx <= h ? (h - worldPx) / 2 : Math.min(0, Math.max(h - worldPx, ty));

      this.view = { scale, tx, ty };
      this.svg.setAttribute('viewBox',
        `${-tx / scale} ${-ty / scale} ${w / scale} ${h / scale}`);
      this.legs.setAttribute('viewBox', `0 0 ${w} ${h}`);
      this.render();
    }

    zoomBy(factor, cx, cy) {
      const { w, h } = this.size;
      if (cx == null) { cx = w / 2; cy = h / 2; }
      const s = this.view.scale * factor;
      // Hold the world point under the cursor still.
      this.setView(s,
        cx - (cx - this.view.tx) * (s / this.view.scale),
        cy - (cy - this.view.ty) * (s / this.view.scale));
    }

    animateTo(scale, tx, ty, onDone) {
      const from = { ...this.view };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.setView(scale, tx, ty);
        if (onDone) onDone();
        return;
      }
      const t0 = performance.now();
      const dur = 420;
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now) => {
        const k = ease(Math.min(1, (now - t0) / dur));
        this.setView(
          from.scale + (scale - from.scale) * k,
          from.tx + (tx - from.tx) * k,
          from.ty + (ty - from.ty) * k);
        if (k < 1) requestAnimationFrame(step);
        else if (onDone) onDone();
      };
      requestAnimationFrame(step);
    }

    /* --- clustering ----------------------------------------------------- */

    clusters() {
      const pts = this.systems
        .filter((s) => this.active.has(s.status))
        .map((s) => ({ sys: s, ...this.toScreen(s) }));

      // Distances are measured against a fixed seed rather than a running
      // mean, otherwise clusters chain across half a continent.
      const out = [];
      for (const p of pts) {
        const near = out.find((c) =>
          Math.hypot(c.seedX - p.x, c.seedY - p.y) < CLUSTER_PX);
        if (near) near.members.push(p);
        else out.push({ seedX: p.x, seedY: p.y, members: [p] });
      }

      for (const c of out) {
        c.x = c.members.reduce((a, m) => a + m.x, 0) / c.members.length;
        c.y = c.members.reduce((a, m) => a + m.y, 0) / c.members.length;
        c.key = c.members.map((m) => m.sys.id).sort().join('|');
        // Would zooming all the way in ever pull these apart? Systems in the
        // same building never separate, so those are the ones we fan out;
        // anything spread over a city or a country is better served by a zoom.
        const xs = c.members.map((m) => m.sys.x);
        const ys = c.members.map((m) => m.sys.y);
        const spread = Math.max(
          Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
        c.separable = spread * this.minScale * MAX_ZOOM_FACTOR > CLUSTER_PX * 1.6;
      }
      return out;
    }

    // Frame a set of members, used when a cluster is better opened by zooming.
    zoomToMembers(members) {
      const { w, h } = this.size;
      const xs = members.map((m) => m.sys.x);
      const ys = members.map((m) => m.sys.y);
      const pad = 0.35;
      const bw = (Math.max(...xs) - Math.min(...xs)) * (1 + pad * 2) || 1;
      const bh = (Math.max(...ys) - Math.min(...ys)) * (1 + pad * 2) || 1;
      const scale = Math.min(w / bw, h / bh);
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
      const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
      this.animateTo(scale, w / 2 - cx * scale, h / 2 - cy * scale);
    }

    // The fan grows with membership, so six pins are no more crowded than two.
    fanRadius(n) {
      return 34 + n * 10;
    }

    // The zoom at which this cluster's fan covers an acceptable patch of
    // ground. Mercator stretches with latitude, hence the cosine. Capped at the
    // map's own zoom limit, so the value is always reachable.
    fanScale(c) {
      const lat = c.members[0].sys.site.lat;
      const kmPerUnit = (EARTH_KM / WORLD_SIZE) * Math.cos((lat * Math.PI) / 180);
      const unitsAllowed = FAN_MAX_KM / kmPerUnit;
      return Math.min(this.minScale * MAX_ZOOM_FACTOR,
        this.fanRadius(c.members.length) / unitsAllowed);
    }

    // Opening a cluster of co-located systems: zoom in first if we are too far
    // out for a fan to make sense, and only then fan.
    openCluster(c) {
      if (c.separable) { this.zoomToMembers(c.members); return; }
      if (this.expanded === c.key) { this.expanded = null; this.render(); return; }

      const target = this.fanScale(c);
      if (this.view.scale >= target * 0.98) {
        this.zooming = false;
        this.expanded = c.key;
        this.render();
        return;
      }
      const { w, h } = this.size;
      const cx = c.members.reduce((a, m) => a + m.sys.x, 0) / c.members.length;
      const cy = c.members.reduce((a, m) => a + m.sys.y, 0) / c.members.length;
      this.zooming = true;
      this.animateTo(target, w / 2 - cx * target, h / 2 - cy * target, () => {
        this.zooming = false;
        this.expanded = c.key;
        this.render();
      });
    }

    // Rotate the fan so its legs land in empty space. Without this, London's
    // five can drop a pin straight on top of a neighbouring city. Only one
    // sector needs scanning — the arrangement repeats every 2π/n.
    bestFanAngle(c, r, clusters) {
      const others = clusters.filter((k) => k !== c);
      if (!others.length) return -Math.PI / 2;
      const n = c.members.length;
      const sector = (2 * Math.PI) / n;
      let best = -Math.PI / 2;
      let bestScore = -Infinity;
      for (let t = 0; t < 12; t++) {
        const a0 = -Math.PI / 2 + (t * sector) / 12;
        let worst = Infinity;
        for (let i = 0; i < n; i++) {
          const a = a0 + i * sector;
          const px = c.x + r * Math.cos(a);
          const py = c.y + r * Math.sin(a);
          for (const o of others) {
            worst = Math.min(worst, Math.hypot(o.x - px, o.y - py));
          }
        }
        if (worst > bestScore) { bestScore = worst; best = a0; }
      }
      return best;
    }

    /* --- rendering ------------------------------------------------------ */

    render() {
      const clusters = this.clusters();
      if (this.expanded) {
        const open = clusters.find((c) => c.key === this.expanded);
        // Zoom back out and the fan would smear across a continent again, so
        // it closes on the way out rather than following you.
        // Not while a zoom is in flight: mid-animation the scale is still low
        // and would read as "the user zoomed out".
        if (!open || (!this.zooming && this.view.scale < this.fanScale(open) * 0.6)) {
          this.expanded = null;
        }
      }

      this.pinLayer.textContent = '';
      this.legs.textContent = '';
      const ns = 'http://www.w3.org/2000/svg';

      // Once the map is zoomed past a continental view there is room to name
      // every pin, which also stops a fanned-out label from looking as though
      // it belongs to a neighbouring city.
      const named = this.view.scale > this.minScale * 3.5;

      for (const c of clusters) {
        if (c.members.length === 1) {
          this.pinLayer.appendChild(this.sitePin(c.members[0], c.x, c.y));
          if (named) this.addLabel(c.members[0].sys, c.x, c.y, true);
          continue;
        }

        if (this.expanded === c.key) {
          const r = this.fanRadius(c.members.length);
          const start = this.bestFanAngle(c, r, clusters);
          c.members.forEach((m, i) => {
            const a = start + (i * 2 * Math.PI) / c.members.length;
            const px = c.x + r * Math.cos(a);
            const py = c.y + r * Math.sin(a);
            const line = document.createElementNS(ns, 'line');
            line.setAttribute('class', 'bsm-leg');
            line.setAttribute('x1', c.x); line.setAttribute('y1', c.y);
            line.setAttribute('x2', px); line.setAttribute('y2', py);
            this.legs.appendChild(line);
            this.pinLayer.appendChild(this.sitePin(m, px, py));
            // Fanned-out pins have room for a name, so say which is which
            // rather than making the reader hover over all of them.
            this.addLabel(m.sys, px, py, Math.cos(a) >= -0.15);
          });
          const dot = document.createElementNS(ns, 'circle');
          dot.setAttribute('class', 'bsm-anchor');
          dot.setAttribute('cx', c.x); dot.setAttribute('cy', c.y);
          dot.setAttribute('r', 3);
          this.legs.appendChild(dot);
        } else {
          this.pinLayer.appendChild(this.clusterPin(c));
        }
      }
    }

    // The label is a second, larger hit target for the same system as its
    // pin — small pins are easy to miss, and the name sits right next to it
    // doing nothing otherwise. tabindex="-1" keeps it out of tab order since
    // the pin itself already covers keyboard access.
    addLabel(sys, x, y, right) {
      const lab = el('button', 'bsm-plabel', this.pinLabel(sys));
      lab.type = 'button';
      lab.tabIndex = -1;
      lab.dataset.side = right ? 'right' : 'left';
      lab.style.left = `${x + (right ? 16 : -16)}px`;
      lab.style.top = `${y}px`;
      lab.addEventListener('mouseenter', () => this.showTip(sys, x, y));
      lab.addEventListener('mouseleave', () => this.hideTip());
      lab.addEventListener('click', (e) => { e.stopPropagation(); this.select(sys.id); });
      this.pinLayer.appendChild(lab);
      // Flip a label that would run off the edge of the map rather than let
      // it disappear under the frame.
      const r = lab.getBoundingClientRect();
      const w = this.wrap.getBoundingClientRect();
      if (right && r.right > w.right - 6) {
        lab.dataset.side = 'left';
        lab.style.left = `${x - 16}px`;
      } else if (!right && r.left < w.left + 6) {
        lab.dataset.side = 'right';
        lab.style.left = `${x + 16}px`;
      }
    }

    sitePin(member, x, y) {
      const sys = member.sys;
      const b = el('button', 'bsm-pin');
      b.type = 'button';
      b.dataset.status = sys.status;
      b.dataset.id = sys.id;
      if (this.selected === sys.id) b.dataset.selected = 'true';
      b.style.left = `${x}px`;
      b.style.top = `${y}px`;
      b.setAttribute('aria-label',
        `${this.pinLabel(sys)}, ${sys.site.lab}, ${sys.site.city} — ${this.statusMeta[sys.status].label}`);

      b.addEventListener('mouseenter', () => this.showTip(sys, x, y));
      b.addEventListener('mouseleave', () => this.hideTip());
      b.addEventListener('focus', () => this.showTip(sys, x, y));
      b.addEventListener('blur', () => this.hideTip());
      b.addEventListener('click', (e) => { e.stopPropagation(); this.select(sys.id); });
      return b;
    }

    // A conic gradient over the member statuses, so a mixed cluster shows its
    // composition without needing to be opened.
    ringFor(members) {
      if (members.length === 1) return `var(${STATUS_VAR[members[0].sys.status]})`;
      const step = 100 / members.length;
      const stops = members.map((m, i) =>
        `var(${STATUS_VAR[m.sys.status]}) ${i * step}% ${(i + 1) * step}%`);
      return `conic-gradient(${stops.join(',')})`;
    }

    clusterPin(c) {
      const b = el('button', 'bsm-pin');
      b.type = 'button';
      b.dataset.cluster = 'true';
      b.style.left = `${c.x}px`;
      b.style.top = `${c.y}px`;
      b.style.setProperty('--bsm-cluster-ring', this.ringFor(c.members));
      const cities = [...new Set(c.members.map((m) => m.sys.site.city))];
      const label = cities.length === 1 ? cities[0] : `${cities.length} cities`;
      b.setAttribute('aria-label',
        `${c.members.length} systems at ${label} — ${c.separable ? 'zoom in' : 'fan out'}`);
      b.appendChild(el('span', 'bsm-count', String(c.members.length)));

      b.addEventListener('mouseenter', () => this.showClusterTip(c, label));
      b.addEventListener('mouseleave', () => this.hideTip());
      b.addEventListener('focus', () => this.showClusterTip(c, label));
      b.addEventListener('blur', () => this.hideTip());
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideTip();
        this.openCluster(c);
      });
      return b;
    }

    /* --- tooltip -------------------------------------------------------- */

    placeTip(x, y) {
      this.tip.style.left = `${x}px`;
      this.tip.style.top = `${y}px`;
      this.tip.dataset.show = 'true';
      // Nudge back inside if the card would hang off the left or right edge.
      const r = this.tip.getBoundingClientRect();
      const w = this.wrap.getBoundingClientRect();
      let dx = 0;
      if (r.left < w.left + 8) dx = w.left + 8 - r.left;
      if (r.right > w.right - 8) dx = w.right - 8 - r.right;
      if (dx) this.tip.style.left = `${x + dx}px`;
      // Flip below the pin when there is no room above.
      this.tip.style.transform = r.top < w.top + 8
        ? 'translate(-50%, 0) translateY(18px)'
        : 'translate(-50%, -100%) translateY(-12px)';
    }

    showTip(sys, x, y) {
      const site = sys.site;
      const also = site.systems.length > 1
        ? `<div class="bsm-hint">${site.systems.length} systems at this site</div>` : '';
      this.tip.innerHTML = `
        <strong>${esc(this.pinLabel(sys))}</strong>
        <span>${esc(site.lab)}<br>${esc(this.place(site))}</span>
        <div class="bsm-tip-status">
          <span class="bsm-glyph" data-status="${esc(sys.status)}"></span>
          ${esc(this.statusMeta[sys.status].label)}
        </div>
        ${also}
        <div class="bsm-hint">Click for details</div>`;
      this.placeTip(x, y);
    }

    showClusterTip(c, label) {
      const counts = {};
      for (const m of c.members) counts[m.sys.status] = (counts[m.sys.status] || 0) + 1;
      const rows = Object.entries(counts).map(([k, n]) =>
        `<div class="bsm-tip-status"><span class="bsm-glyph" data-status="${esc(k)}"></span>${n} ${esc(this.statusMeta[k].label.toLowerCase())}</div>`).join('');
      const sites = [...new Set(c.members.map((m) => m.sys.site.id))];
      this.tip.innerHTML = `
        <strong>${esc(label)}</strong>
        <span>${c.members.length} systems across ${sites.length} site${sites.length === 1 ? '' : 's'}</span>
        ${rows}
        <div class="bsm-hint">${c.separable ? 'Click to zoom in' : 'Click to open'}</div>`;
      this.placeTip(c.x, c.y);
    }

    hideTip() { this.tip.dataset.show = 'false'; }

    /* --- detail panel --------------------------------------------------- */

    // Make sure a given system is actually visible as its own pin: zoom in
    // while its cluster can still be broken up, then fan out what is left.
    //
    // Only for selections the user did not make by pointing at a pin — deep
    // links and the "also at this site" buttons. Clicking a visible pin must
    // never move the map: revealing something already on screen achieved
    // nothing and could fling the view across Europe if the cluster maths
    // disagreed about where we were.
    reveal(id, depth = 0) {
      const c = this.clusters().find((k) => k.members.some((m) => m.sys.id === id));
      if (!c || c.members.length === 1) return;
      if (!c.separable) {
        if (this.expanded !== c.key) this.openCluster(c);
        return;
      }
      if (depth > 3) return;
      this.zoomToMembers(c.members);
      setTimeout(() => this.reveal(id, depth + 1), 460);
    }

    select(id, { reveal = false } = {}) {
      if (id !== this.selected) this.showAllPubs = false;
      // Opening the panel takes width off the map. Remember the centre so the
      // map can be nudged to keep it, rather than being shoved sideways.
      const widthBefore = this.size.w;
      this.selected = id;
      const sys = this.systems.find((x) => x.id === id);
      if (!sys) return;
      const site = sys.site;
      const heading = this.title(sys);

      // Publications belong to the site: everyone there uses whichever system
      // is free, so the wording follows the number of systems, not the pin.
      // A site with no tagged papers gets no publications section at all. An
      // empty list would read as "this system has produced nothing", when in
      // fact it may just be untagged — or still being built.
      //
      // Sites with several systems name themselves in the heading ("from SWC
      // systems") rather than saying "these systems", which is vague when you
      // arrived by clicking one pin out of six. Only SWC and the Crick have
      // more than one.
      const many = site.systems.length > 1;
      const pubs = this.pubsFor(site.id);
      const shown = this.showAllPubs ? pubs : pubs.slice(0, PUBS_SHOWN);
      const pubRows = shown
        .map((p) => `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a><em>${esc(p.venue)} · ${p.year}</em></li>`)
        .join('')
        + (pubs.length > shown.length
          ? `<li><button type="button" class="bsm-more" data-more>Show all ${pubs.length}</button></li>` : '');

      // The spreadsheet's status text often just repeats the status itself
      // ("Under construction"), which would print twice.
      const label = this.statusMeta[sys.status].label;
      const detail = (sys.statusDetail || '').toLowerCase() === label.toLowerCase()
        ? null : sys.statusDetail;

      // No specification section. The systems are variations on one design and
      // the differences do not mean anything to a visitor; sites.json still
      // carries `microscope` and `selfBuilt` for when a real distinction turns
      // up, such as the cryostat variant.
      const where = [
        site.lab === heading ? null : site.lab,
        site.org,
      ].filter(Boolean).map(esc).join(' · ');

      const others = site.systems.filter((x) => x.id !== sys.id);

      this.panel.innerHTML = `
        <figure class="bsm-panel-figure">
          <img src="${esc(this.base + sys.photo)}" alt="${sys.photoStandIn
            ? 'Stand-in image: a Nerf ZombieStrike BrainSaw toy. No photograph of '
              + esc(heading) + ' yet.'
            : 'Photograph of ' + esc(heading)}">
          <button class="bsm-panel-close" aria-label="Close details">&times;</button>
        </figure>
        <div class="bsm-panel-body">
          <h2>${esc(heading)}</h2>
          <p class="bsm-where">${where ? where + '<br>' : ''}${esc(this.place(site))}</p>

          <div class="bsm-status-line">
            <span class="bsm-glyph" data-status="${esc(sys.status)}"></span>
            ${esc(this.statusMeta[sys.status].label)}
          </div>
          ${detail ? `<p class="bsm-notes">${esc(detail)}</p>` : ''}

          ${site.organisers && site.organisers.length ? `<div class="bsm-sec">
            <h3>Organiser${site.organisers.length > 1 ? 's' : ''}</h3>
            ${site.organisers.map((o) =>
              // Names only. Every role in the spreadsheet was a variation on
              // "Contact", which the heading already says.
              `<div class="bsm-person"><span style="color:var(--bsm-ink)">${esc(o.name)}</span></div>`).join('')}
          </div>` : ''}

          ${pubs.length ? `<div class="bsm-sec">
            <h3>Publications from ${many
              ? esc(site.systemsName || site.short || site.lab) + ' systems'
              : 'this system'} (${pubs.length})</h3>
            <ul class="bsm-pubs">${pubRows}</ul>
          </div>` : ''}

          ${others.length ? `<div class="bsm-sec">
            <h3>Also at ${esc(site.short || site.lab)}</h3>
            <div class="bsm-siblings">${others.map((x) =>
              `<button type="button" data-goto="${esc(x.id)}">${esc(x.name || 'System')}</button>`).join('')}</div>
          </div>` : ''}
        </div>`;

      this.panel.dataset.open = 'true';
      if (!this.showAllPubs) this.panel.scrollTop = 0;
      this.panel.querySelector('.bsm-panel-close')
        .addEventListener('click', () => this.deselect());
      this.panel.querySelectorAll('[data-goto]').forEach((b) =>
        b.addEventListener('click', () => this.select(b.dataset.goto, { reveal: true })));
      const more = this.panel.querySelector('[data-more]');
      if (more) more.addEventListener('click', () => {
        this.showAllPubs = true;
        this.select(id);
      });

      this.keepCentre(widthBefore);
      this.render();
      requestAnimationFrame(() => {
        this.resize();
        if (reveal) this.reveal(id);
      });
    }

    deselect() {
      if (!this.selected) return;
      const widthBefore = this.size.w;
      this.selected = null;
      this.showAllPubs = false;
      this.panel.dataset.open = 'false';
      this.panel.textContent = '';
      this.keepCentre(widthBefore);
      this.render();
      requestAnimationFrame(() => this.resize());
    }

    // The panel appears and disappears at the right-hand edge, so the map keeps
    // its left edge and the view would otherwise slide sideways under you.
    keepCentre(widthBefore) {
      const delta = this.size.w - widthBefore;
      if (delta) this.setView(this.view.scale, this.view.tx + delta / 2, this.view.ty);
    }

    /* --- events --------------------------------------------------------- */

    wire() {
      this.root.querySelector('.bsm-close')
        .addEventListener('click', () => this.close());

      this.root.addEventListener('mousedown', (e) => {
        if (e.target === this.root) this.close();
      });

      this.root.querySelector('.bsm-zoom').addEventListener('click', (e) => {
        const act = e.target.dataset.act;
        if (act === 'in') this.zoomBy(1.6);
        else if (act === 'out') this.zoomBy(1 / 1.6);
        else if (act === 'home') { this.expanded = null; this.home(); }
      });

      this.wrap.addEventListener('wheel', (e) => {
        e.preventDefault();
        const r = this.wrap.getBoundingClientRect();
        this.zoomBy(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });

      // Drag to pan.
      let dragging = false, last = null;
      this.dragged = 0;
      const down = (e) => {
        if (e.button != null && e.button !== 0) return;
        dragging = true;
        this.dragged = 0;
        last = { x: e.clientX, y: e.clientY };
        this.wrap.dataset.panning = 'true';
      };
      const move = (e) => {
        if (!dragging) return;
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        this.dragged += Math.abs(dx) + Math.abs(dy);
        last = { x: e.clientX, y: e.clientY };
        this.setView(this.view.scale, this.view.tx + dx, this.view.ty + dy);
      };
      const up = () => {
        dragging = false;
        this.wrap.dataset.panning = 'false';
      };
      this.wrap.addEventListener('pointerdown', down);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);

      // Collapsing a fanned cluster happens on `click`, not on pointerup.
      // Doing it earlier re-rendered the pins out from under the pointer, so
      // the click then landed on whatever pin had just been drawn there —
      // which swallowed pin clicks and occasionally flung the map across the
      // world. Pin and cluster handlers stopPropagation, so anything reaching
      // here really is the background.
      this.wrap.addEventListener('click', () => {
        if (this.dragged < 4 && this.expanded) {
          this.expanded = null;
          this.render();
        }
      });

      this.wrap.addEventListener('dblclick', (e) => {
        const r = this.wrap.getBoundingClientRect();
        this.zoomBy(1.9, e.clientX - r.left, e.clientY - r.top);
      });

      this.onKey = (e) => {
        if (this.root.dataset.open !== 'true') return;
        if (e.key === 'Escape') {
          if (this.selected) this.deselect();
          else if (this.expanded) { this.expanded = null; this.render(); }
          else this.close();
        }
      };
      window.addEventListener('keydown', this.onKey);

      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.wrap);
    }

    resize() {
      const { w, h } = this.size;
      if (!w || !h) return;
      this.setView(this.view.scale, this.view.tx, this.view.ty);
    }

    /* --- lifecycle ------------------------------------------------------ */

    open() {
      this.root.dataset.open = 'true';
      this.prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        this.home();
        this.root.querySelector('.bsm-close').focus();
      });
    }

    close() {
      this.root.dataset.open = 'false';
      document.body.style.overflow = this.prevOverflow || '';
      this.hideTip();
      this.deselect();
      if (this.opener) this.opener.focus();
    }
  }

  // `base` is where this applet's own folder sits relative to the host page:
  // '' when index.html sits beside it, 'brainsaw_map/' when the facility page
  // includes it from the site root. Everything the applet owns — sites.json,
  // world.js, the photographs — hangs off it.
  //
  // `pubs` does not: publications.json belongs to the facility site, not to
  // this project, and lives one level above. Hence the default of `../`
  // relative to `base`, which resolves correctly from either place. Pass an
  // absolute URL when the real page has it somewhere else again.
  async function create({ base = '', pubs = `${base}../assets/data/publications.json` } = {}) {
    const [siteData, pubData] = await Promise.all([
      fetch(`${base}data/sites.json`).then((r) => r.json()),
      fetch(pubs).then((r) => r.json()),
    ]);
    return new Map(siteData, pubData, base);
  }

  return { create };
})();
