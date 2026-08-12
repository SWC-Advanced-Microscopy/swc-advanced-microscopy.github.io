---
# Front matter so Liquid resolves the data URL below. It matters because the
# site-rebuild test repo serves from a subpath rather than the domain root.
---

// Renders the compact, collapsible publication lists on the platform pages.
//
// Markup contract — no per-page JavaScript needed:
//
//   <details class="pub-details" id="bs-pubs" data-pub-list data-pub-equipment="BrainSaw">
//     <summary><h2>BrainSaw Publications</h2></summary>
//     <ul class="pub-compact"></ul>
//   </details>
//
// Filter on any of the array fields in publications.json with the matching
// data attribute; combining several requires a publication to match them all.
// The heading text is the page's, with the count appended once we have it, so
// the section still reads correctly if the fetch fails.
//
// Each entry ends with a dimmed note, chosen with data-pub-meta: a space-
// separated list of fields to name there, defaulting to where the work was
// done. A platform page wants the equipment or technique, since its own
// filter already fixes everything else; entries with nothing to say in the
// chosen fields simply get no note.

const PUB_FILTER_ATTRS = {
  pubEquipment: 'equipment',
  pubPlatform: 'platforms',
  pubSoftwareTool: 'software_tools',
  pubTechnique: 'techniques'
};

const PUB_META_FIELDS = ['location', 'equipment', 'software_tools', 'techniques', 'platforms'];

// Where the work was done, as it should read on the page.
const PUB_LOCATION_LABELS = { 'AMF': 'SWC', 'UCL, Clark': 'UCL' };

// A paper is tagged with everything it used, which can span platforms, so a
// platform page names only what platforms.json assigns to that platform.
function pubMetaText(p, fields, roster) {
  return fields.flatMap(field => {
    if (field === 'location') {
      return [PUB_LOCATION_LABELS[p.instrument_location] || p.instrument_location];
    }
    if (!roster || !roster[field]) return p[field];
    return p[field].filter(v => roster[field].includes(v));
  }).join(', ');
}

async function initPublicationLists() {
  const sections = document.querySelectorAll('[data-pub-list]');
  if (!sections.length) return;

  let data, platforms;
  try {
    const [pubRes, platRes] = await Promise.all([
      fetch('{{ "/assets/data/publications.json" | relative_url }}'),
      fetch('{{ "/assets/data/platforms.json" | relative_url }}')
    ]);
    data = (await pubRes.json()).publications;
    platforms = (await platRes.json()).platforms;
  } catch (err) {
    sections.forEach(s => {
      s.querySelector('ul').textContent = 'Could not load publication data.';
    });
    return;
  }

  sections.forEach(section => {
    const filters = Object.entries(PUB_FILTER_ATTRS)
      .filter(([attr]) => section.dataset[attr] !== undefined)
      .map(([attr, field]) => p => p[field].includes(section.dataset[attr]));

    const pubs = data
      .filter(p => filters.every(match => match(p)))
      .sort((a, b) => b.year - a.year);

    const heading = section.querySelector('summary h2');
    if (heading) heading.textContent = `${heading.textContent.trim()} (${pubs.length})`;

    const metaFields = (section.dataset.pubMeta || 'location')
      .split(/\s+/)
      .filter(field => PUB_META_FIELDS.includes(field));
    const roster = platforms[section.dataset.pubPlatform];

    section.querySelector('ul').innerHTML = pubs.map(p => {
      // Consortium "authors" carry a space; individual surnames don't, so only
      // the latter get an "et al.".
      const author = p.first_author.includes(' ') ? p.first_author : `${p.first_author}, et al.`;
      const meta = pubMetaText(p, metaFields, roster);
      return `<li><a href="${p.url}">${author} ${p.journal}, ${p.year}</a>` +
             (meta ? `<span class="pub-compact__loc">${meta}</span>` : '') + `</li>`;
    }).join('');
  });
}

// Older browsers don't auto-expand a <details> that a fragment link targets.
function openPublicationListFromHash() {
  if (!location.hash) return;
  const target = document.querySelector(`#${CSS.escape(location.hash.slice(1))}[data-pub-list]`);
  if (target) target.open = true;
}
window.addEventListener('hashchange', openPublicationListFromHash);

initPublicationLists().then(openPublicationListFromHash);
