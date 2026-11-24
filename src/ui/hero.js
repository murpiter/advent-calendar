import { $, el, trustedSvg } from './dom.js';

const CORNERS = ['tl', 'tr', 'bl', 'br'];

function renderCorners(theme) {
  const frame = $('frame');
  frame.querySelectorAll('.corner').forEach((node) => node.remove());
  if (!theme.corner) return;
  for (const position of CORNERS) frame.prepend(trustedSvg(`corner ${position}`, theme.corner));
}

export function renderHero(theme, title, lines) {
  const art = trustedSvg('', theme.hero(title)).firstElementChild;
  art.classList.add('hero-svg');
  $('hero').replaceChildren(art, el('h1', '', title), ...lines.map((line) => el('p', '', line)));
  renderCorners(theme);
}
