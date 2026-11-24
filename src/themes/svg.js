export function svg(viewBox, inner) {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

function flakeArm(angle, r) {
  return `<g transform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="${-r}"/>`
    + `<path d="M0 ${-r * .55} l${-r * .22} ${-r * .2} M0 ${-r * .55} l${r * .22} ${-r * .2} `
    + `M0 ${-r * .78} l${-r * .15} ${-r * .14} M0 ${-r * .78} l${r * .15} ${-r * .14}"/></g>`;
}

export function flake(arms, r, stroke, width) {
  const body = Array.from({ length: arms }, (_, k) => flakeArm(k * 360 / arms, r)).join('');
  return `<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
}

export function placeFlakes(spots, toFlake) {
  return spots.map(([x, y, ...rest], i) => `<g transform="translate(${x} ${y})">${toFlake(i, ...rest)}</g>`).join('');
}
