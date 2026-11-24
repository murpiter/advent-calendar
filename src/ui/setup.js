import { THEMES } from '../themes/index.js';
import { $, el, trustedSvg } from './dom.js';

export const parseItems = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

function themeCard(theme, selected, strings) {
  const card = el('button', `tcard t-${theme.id}`);
  card.type = 'button';
  card.dataset.theme = theme.id;
  card.setAttribute('aria-pressed', String(selected));
  const names = strings.themes[theme.id];
  card.append(trustedSvg('sw', theme.swatch), el('b', '', names.name), el('small', '', names.sub));
  return card;
}

export function renderThemes(current, strings) {
  $('themes').replaceChildren(...Object.values(THEMES).map((theme) => themeCard(theme, theme.id === current, strings)));
}

export function renderCount(days, strings) {
  const n = parseItems($('itemsIn').value).length;
  const count = $('count');
  count.textContent = strings.count(n, days);
  count.classList.toggle('bad', n !== days);
}

export function fillForm({ title, items }) {
  $('titleIn').value = title;
  $('itemsIn').value = items.join('\n');
}

export function validateItems(items, days, strings) {
  if (items.length < days) return strings.tooFew(items.length, days);
  if (items.length > days) return strings.tooMany(items.length, days);
  return '';
}
