const NS = 'http://www.w3.org/2000/svg';
const positions = { 1: [160, 72], 2: [82, 190], 3: [238, 190] };
const labels = {
  1: [[135, 48], [185, 46]], 2: [[57, 166], [107, 164]],
  3: [[100, 93], [72, 125]], 4: [[213, 166], [263, 164]],
  5: [[220, 93], [248, 125]], 6: [[139, 226], [182, 233]],
  7: [[50, 111], [270, 111]]
};
function svgElement(tag, attributes = {}, text) {
  const element = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (text !== undefined) element.textContent = text;
  return element;
}
function region(extension, predicate) {
  const r = predicate === 'P' ? 38 : 44;
  const attributes = { class: `predicate-region ${predicate.toLowerCase()}`, 'data-predicate': predicate };
  if (extension.length === 1) {
    const [cx, cy] = positions[extension[0]];
    return svgElement('circle', { ...attributes, cx, cy, r });
  }
  if (extension.length === 2) {
    const [[x1, y1], [x2, y2]] = extension.map(n => positions[n]);
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return svgElement('rect', { ...attributes, x: -r, y: -r, width: length + 2 * r,
      height: 2 * r, rx: r, transform: `translate(${x1} ${y1}) rotate(${angle})` });
  }
  return svgElement('ellipse', { ...attributes, cx: 160, cy: 153,
    rx: predicate === 'P' ? 126 : 132, ry: predicate === 'P' ? 118 : 124 });
}

// The caller supplies the visible vocabulary; the adjacent model description
// provides the accessible text equivalent, including empty extensions.
export function modelPicture(model, used) {
  const picture = document.createElement('div');
  picture.className = 'model-picture';
  picture.setAttribute('aria-hidden', 'true');
  const legend = document.createElement('div');
  legend.className = 'predicate-key';
  for (const p of used.predicates) {
    const item = document.createElement('span');
    item.className = `predicate-key-item ${p.toLowerCase()}`;
    item.textContent = `${p}${model.predicates[p].length ? '' : ': none'}`;
    legend.append(item);
  }
  picture.append(legend);

  if (used.predicates.includes('R') || model.domain.length !== 3 || ![1, 2, 3].every(n => model.domain.includes(n))) {
    // Membership labels also handle R until a three-predicate region design is chosen.
    const columns = document.createElement('div');
    columns.className = 'diagram object-columns';
    for (const n of model.domain) {
      const object = document.createElement('div'); object.className = 'object';
      const number = document.createElement('div'); number.className = 'number'; number.textContent = n;
      const names = document.createElement('div'); names.className = 'names';
      names.textContent = used.constants.filter(c => model.constants[c] === n).join(', ');
      const tags = document.createElement('div'); tags.className = 'tags';
      for (const p of used.predicates.filter(p => model.predicates[p].includes(n))) {
        const tag = document.createElement('span'); tag.className = `tag ${p.toLowerCase()}`;
        tag.textContent = p; tags.append(tag);
      }
      object.append(number, names, tags); columns.append(object);
    }
    picture.append(columns);
    return picture;
  }

  const svg = svgElement('svg', { class: 'diagram set-diagram', viewBox: '0 0 320 294', focusable: 'false' });
  const regions = used.predicates.filter(p => model.predicates[p].length).map(p => region(model.predicates[p], p));
  // Separate fills from outlines so both outlines remain visible in overlaps.
  for (const shape of regions) { const fill = shape.cloneNode(true); fill.classList.add('region-fill'); svg.append(fill); }
  for (const shape of regions) { shape.classList.add('region-outline'); svg.append(shape); }
  for (const p of used.predicates) {
    const mask = model.predicates[p].reduce((bits, n) => bits | (1 << (n - 1)), 0);
    if (!mask) continue;
    const [x, y] = labels[mask][p === 'P' ? 0 : 1];
    svg.append(svgElement('text', { x, y, class: `predicate-label ${p.toLowerCase()}` }, p));
  }
  for (const n of [1, 2, 3]) {
    const [x, y] = positions[n];
    svg.append(svgElement('circle', { cx: x, cy: y, r: 16, class: 'object-node', 'data-object': n }));
    svg.append(svgElement('text', { x, y: y + 1, class: 'object-number' }, n));
    svg.append(svgElement('text', { x, y: y + 32, class: 'object-names' },
      used.constants.filter(c => model.constants[c] === n).join(', ')));
  }
  picture.append(svg);
  return picture;
}
