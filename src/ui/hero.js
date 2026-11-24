import { $, el, trustedSvg } from './dom.js';

const CORNERS = ['tl', 'tr', 'bl', 'br'];

function renderCorners(theme) {
  const frame = $('frame');
  frame.querySelectorAll('.corner').forEach((node) => node.remove());
  if (!theme.corner) return;
  for (const position of CORNERS) frame.prepend(trustedSvg(`corner ${position}`, theme.corner));
}

export function renderHero(theme, title, subtitle) {
  const hero = trustedSvg('', theme.hero());
  hero.firstElementChild.classList.add('hero-svg');
  $('hero').replaceChildren(hero.firstElementChild, el('h1', '', title), el('p', '', subtitle));
  renderCorners(theme);
}
