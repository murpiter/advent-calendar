import { DAY_OPTIONS } from '../domain/calendar.js';
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

function dayOption(days, selected) {
  const input = el('input');
  Object.assign(input, { type: 'radio', name: 'days', value: String(days), checked: selected });
  const option = el('label', 'seg');
  option.append(input, el('span', '', String(days)));
  return option;
}

function renderDays(current) {
  $('daysIn').replaceChildren(...DAY_OPTIONS.map((days) => dayOption(days, days === current)));
}

export const selectedDays = () => Number($('daysIn').querySelector('input:checked').value);

export function renderCount(strings) {
  const days = selectedDays();
  const n = parseItems($('itemsIn').value).length;
  const count = $('count');
  count.textContent = strings.count(n, days);
  count.classList.toggle('bad', n !== days);
}

export function fillForm({ title, items }) {
  $('titleIn').value = title;
  $('itemsIn').value = items.join('\n');
}

export function renderSetupForm(state, strings) {
  renderThemes(state.theme, strings);
  renderDays(state.days);
  fillForm(state);
  $('unlockIn').checked = state.unlocked;
  $('demoIn').checked = state.demo;
  renderCount(strings);
}

export function validateItems(items, days, strings) {
  if (items.length < days) return strings.tooFew(items.length, days);
  if (items.length > days) return strings.tooMany(items.length, days);
  return '';
}
