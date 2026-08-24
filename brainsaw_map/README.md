# BrainSaw adopter map — proof of principle

An interactive world map of BrainSaw installations, built to be opened from a button on
<https://swcmicroscopy.com/brainsaw/> as a full-screen overlay.

The systems, people and locations are **real**, transcribed from Rob's tracking spreadsheet
into `data/sites.json`. The publications are **real**, taken from the SWC publications page.
The photographs are real for the five systems we have pictures of; the rest show a toy
chainsaw, clearly captioned. See `../.claude/brief.md` for the design brief and the decisions
behind it.

## Run it

```bash
./serve.sh            # http://localhost:8765/brainsaw_map/
```

A server is needed because the applet fetches two JSON files, which browsers refuse over
`file://`. It serves the **parent** directory, not this one: `publications.json` belongs to the
facility site rather than to this project and sits outside it, so a server rooted here could not
reach it. That also mirrors how the real page will host it.

Deep links: `#map` opens the overlay, `#map/<system-id>` opens it on one system
(for example `#map/swc-brainsaw`), zooming and fanning out as needed to reveal that pin.

## Data model

A **site** is a lab or facility at one location. A site may hold several **systems** — SWC has
three. Pins are per system; **publications belong to the site**, because the people there use
whichever system is free. The detail panel says "Publications from this system" or "…from
these systems" depending on how many the site has.

```
brainsaw_map/data/sites.json    sites[] → systems[]
assets/data/publications.json   publications[] → a site, via instrument_location
```

The first belongs to the applet; the second belongs to the facility site and lives one level
above it. `BrainSawMap.create()` takes `base` — where this folder sits relative to the host page
('' beside `index.html`, `'brainsaw_map/'` from the site root) — and finds publications at
`${base}../assets/data/publications.json`, which resolves correctly from either. Pass
`{ pubs: '…' }` to point somewhere else entirely. Photo paths in `sites.json` are relative to
this folder and get the same `base` prefix, so they survive the move too.


E-mail addresses were deliberately left out; contact names are derived from them.

### Photographs

`tools/make_thumbs.py` writes a 720×540 `_small.jpg` beside each original; the map uses those
and the full-size files stay put as the archive copy. The panel figure is 4:3 to match — these
are tall instruments shot from the front, and the earlier 3:2 crop took the objective off the
top.

Systems with no photograph carry `"photoStandIn": true` and show the Nerf ZombieStrike
**BrainSaw**. A generic microscope picture would be a small lie; a toy chainsaw cannot be
mistaken for the instrument, so it reads as a gap without needing to be labelled as one — it
carries no visible caption, only alt text and a line in the panel's footnote. Drop a real
photograph in, point `photo` at it and delete the flag.

Each system carries `built`, the year it came into service; it shows in the status pill in the
panel and after the status in the tooltip. Systems still under construction have `null` and
show no year — a year not yet reached is not a fact, and the status already says construction is
under way. Retired and paused systems keep theirs, because when a system was built is part of
the record whether or not it is running today.

`microscope` and `selfBuilt` are still in the JSON but **nothing displays them**. The systems
are variations on one design and the differences mean little to a visitor; bring them back when
there is a real distinction to draw, such as the coming cryostat variant.

### What is on the map

**Stalled entries are left out.** A system appears once money has been committed and work is
under way — "under discussion but stalled" is a twinkle in the eye. Currently excluded on that
basis: Han lab (Wuhan), CSHL, Trondheim. They stay in the spreadsheet, not in `sites.json`.

| Status | In the data | Pin |
|---|---|---|
| `in-use` | 10 | solid green |
| `building` | 2 — CrickSaw02, MPI Munich | amber with halo |
| `planned` | 1 — Hebrew University, "construction soon" | hollow blue ring |
| `paused` | 1 — NERF, under renovation | solid grey |
| `eol` | 1 — Petersen lab | hollow grey outline |

A status with nothing in it gets no chip, so the header only shows states that exist.

Colour never carries meaning alone: each status has its own pin geometry and is always named
in the header chips, the tooltip and the panel. There are four hues rather than five because a
fifth could not clear colour-blind separation against the others — `paused` and `eol` both mean
"not running", so they share the grey and differ by fill versus outline. The four were checked
with a CVD validator against the applet's own dark surface: worst all-pairs ΔE 10.7 simulated,
17.0 normal vision, all above 3:1 contrast.

## Publication tagging

`../assets/data/publications.json` is Rob's file, in the schema the SWC publications page will
itself use. The map reads it **as written** and adapts it in `adaptPublications()`; it is never
hand-reshaped, because the entire point of the file is that nobody has to guess who did what.

Two fields do the work:

- `equipment` must contain `"BrainSaw"`. The file also covers light-sheet, SP8 and TissueVision
  work, which is not about these microscopes. 33 of the 42 entries qualify.
- `instrument_location` says **where the imaging happened**, which is not the authors'
  institution — that is `external_institution`. The distinction is the whole value of the file:
  Ede Rancz was at the Crick, and which system he actually used is a separate question this
  field answers.

| `instrument_location` | Site | Papers |
|---|---|---|
| `AMF` | `swc` | 25 |
| `EPFL` | `petersen` (retired) | 5 |
| `Francis Crick Institute` | `crick` | 1 |
| `UCL` | `clark` (RockSaw) | 2 |

**Nothing is unattributed any more**, and no attribution comes from guessing at author names.

`UCL` means "UCL but not SWC", which resolves to RockSaw only because it is currently the sole
other UCL system. That is true by accident of the dataset, not by construction, so an
unrecognised `instrument_location` makes `adaptPublications()` log an error and skip the paper
**loudly**. A silently missing publication is invisible: nobody notices a count of 24 that
should have been 25.

A site with no papers simply has no publications section — no "(0)", no empty list. Absent
tags are not the same as absent papers, and a system still being built has obviously not
published yet; neither deserves a card that reads like a reproach.

This is also why retired systems stay on the map and are shown by default — the EPFL system is
no longer running, but its five papers are part of the record.

### Worth knowing

- The two Basel papers are `TissueCyte`, not BrainSaw, so the map correctly leaves them out.
  Note the file spells the same instrument two ways — `TissueVision` (SWC's, 2 papers) and
  `TissueCyte` (Basel's, 2 papers). Harmless here since neither is a BrainSaw.
- `techniques` is populated on 2 of 42 entries. Filling it in would let the map say what the
  network is *used for* — probe tracks, cell counting, single-axon tracing — which nothing else
  on the site says.
- There is no author field, so citations read title · journal · year rather than naming anyone.

## What it does

- **Self-contained basemap.** Natural Earth coastlines are pre-projected into Web Mercator and
  baked into `map/world.js`. No tile server, no CDN, no external request of any kind.
- **Pan and zoom** by drag, wheel, double-click or the buttons.
- **Clustering that knows the difference between crowded and co-located.** Pins within 38 px
  merge into a counted pin whose ring is segmented by the statuses inside it. Clicking it
  **zooms in** if zooming would ever separate the members, and **fans them out** on leader
  lines if it would not — which is the London case, where six systems across three sites sit
  within a few hundred metres. The fan rotates to avoid landing on neighbouring pins, and every
  fanned pin is labelled.
- **A fan is always local.** Because the fan is laid out in screen pixels, opening one at a
  far-out zoom would scatter London's systems across northern Europe. So a fan first zooms in
  until it covers no more than `FAN_MAX_KM` (40 km) of ground, and closes again if you zoom
  back out past that point. The fan is a diagram, not a claim about position — the systems it
  separates are often in the same building — so keeping it inside a city-sized footprint is
  what stops it lying.
- **Hover to skim, click to read.**
- **Status filters** in the header, which double as the legend.

## Layout of the repo

```
../assets/data/         publications.json — the facility site's file, outside this project
../.claude/brief.md     the design brief
index.html              stand-in host page with the launch button
map/brainsaw-map.js     the applet
map/brainsaw-map.css    its styling, all namespaced .bsm-
map/world.js            generated country outlines (do not hand-edit)
data/sites.json         the systems
system_photos/          photographs: originals plus the *_small.jpg the map uses
tools/build_world.py    regenerates map/world.js
tools/make_thumbs.py    re-crops the photographs for the panel
tools/make_photos.py    superseded: the old synthetic placeholders
serve.sh                local web server
```

## Regenerating the basemap

```bash
curl -sLO https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json
python3 tools/build_world.py countries-50m.json
```

`map/world.js` is 929 kB (about 346 kB gzipped) at a simplification tolerance of 0.04, which
holds the coastline within ~3 px even at full zoom. That tolerance and `MAX_ZOOM_FACTOR` in
`map/brainsaw-map.js` (55) move together: raising `TOLERANCE` shrinks the file quickly — 0.15
roughly halves it — but then the zoom cap has to come down or the coast turns to facets.

Rings that cross the antimeridian are unwrapped and drawn again a world-width away, so Russia's
mainland appears in one piece with its Chukotka tip at the left-hand edge, the way a Mercator
world map normally shows it.

## Known limits

- Coastlines are 1:50m: fine at every zoom the applet allows, but there is no street-level
  detail, so a fanned-out London sits on a recognisable Thames rather than on streets. That was
  the accepted trade for having no external dependencies.
- Mobile is usable but not tuned.
- Ten of the fifteen systems have no photograph yet.
- The publication join reads a local file; in production it would parse the live page.
- No build step: if this ships, `world.js` and the JSON are worth inlining into one file so
  the WordPress side loads a single asset.
