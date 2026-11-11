const NS = 'http://www.w3.org/2000/svg';
const layouts = {
  1: [[160, 142]],
  2: [[82, 142], [238, 142]],
  3: [[160, 72], [82, 190], [238, 190]],
  4: [[82, 72], [238, 72], [82, 206], [238, 206]]
};
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
function convexHull(points) {
  const sorted = [...points].sort(([x1,y1],[x2,y2]) => x1-x2 || y1-y2);
  const cross = ([ax,ay],[bx,by],[cx,cy]) => (bx-ax)*(cy-ay)-(by-ay)*(cx-ax);
  const half = points => {
    const result = [];
    for (const point of points) {
      while (result.length > 1 && cross(result.at(-2),result.at(-1),point) <= 0) result.pop();
      result.push(point);
    }
    return result.slice(0,-1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}
// Offset a convex hull with circular corners, so every included object and its
// names have the same padding as a singleton circle or two-object enclosure.
function roundedHull(points, r) {
  const hull = convexHull(points);
  const offset = (point, from, to) => {
    const dx=to[0]-from[0], dy=to[1]-from[1], length=Math.hypot(dx,dy);
    return [point[0]+r*dy/length,point[1]-r*dx/length];
  };
  return hull.map((point,i) => {
    const previous=hull[(i+hull.length-1)%hull.length], next=hull[(i+1)%hull.length];
    const start=offset(point,previous,point), end=offset(point,point,next);
    return `${i ? 'L' : 'M'} ${start.join(' ')} A ${r} ${r} 0 0 1 ${end.join(' ')}`;
  }).join(' ')+' Z';
}
function region(extension, predicate, positions, size) {
  const r = { P:38, Q:44, R:50 }[predicate];
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
  if (size === 3) return svgElement('ellipse', { ...attributes, cx: 160, cy: 153,
    rx: 126+(r-38), ry: 118+(r-38) });
  return svgElement('path', { ...attributes, d: roundedHull(extension.map(n => positions[n]),r) });
}
function regionLabel(extension, predicate, positions, domain) {
  if (domain.length === 3 && predicate !== 'R') {
    const mask=extension.reduce((bits,n) => bits | (1 << domain.indexOf(n)),0);
    return labels[mask][predicate === 'P' ? 0 : 1];
  }
  if (domain.length === 3 && extension.length === 3) return [160,25];
  const top=Math.min(...extension.map(n => positions[n][1]));
  const topPoints=extension.map(n => positions[n]).filter(([,y]) => y === top);
  const x=topPoints.reduce((sum,[x]) => sum+x,0)/topPoints.length;
  const shift=domain.length === 3 ? 0 : {P:-24,Q:0,R:24}[predicate];
  return [x+shift,top-({P:38,Q:44,R:50}[predicate])+6];
}

// The caller supplies the visible vocabulary; the adjacent model description
// provides the accessible text equivalent, including empty extensions.
export function modelPicture(model, used) {
  const layout=layouts[model.domain.length];
  if (!layout) throw new RangeError('Model pictures support domains of one to four objects.');
  const positions=Object.fromEntries(model.domain.map((n,i) => [n,layout[i]]));
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

  const svg = svgElement('svg', { class: 'diagram set-diagram', viewBox: '0 0 320 294', focusable: 'false' });
  const regions = used.predicates.filter(p => model.predicates[p].length).map(p => region(model.predicates[p], p,positions,model.domain.length));
  // Separate fills from outlines so both outlines remain visible in overlaps.
  for (const shape of regions) { const fill = shape.cloneNode(true); fill.classList.add('region-fill'); svg.append(fill); }
  for (const shape of regions) { shape.classList.add('region-outline'); svg.append(shape); }
  for (const p of used.predicates) {
    if (!model.predicates[p].length) continue;
    const [x,y] = regionLabel(model.predicates[p],p,positions,model.domain);
    svg.append(svgElement('text', { x, y, class: `predicate-label ${p.toLowerCase()}` }, p));
  }
  for (const n of model.domain) {
    const [x, y] = positions[n];
    svg.append(svgElement('circle', { cx: x, cy: y, r: 16, class: 'object-node', 'data-object': n }));
    svg.append(svgElement('text', { x, y: y + 1, class: 'object-number' }, n));
    svg.append(svgElement('text', { x, y: y + 32, class: 'object-names' },
      used.constants.filter(c => model.constants[c] === n).join(', ')));
  }
  picture.append(svg);
  return picture;
}
