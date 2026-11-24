import { doorState } from '../domain/calendar.js';
import { $, el, prefersReducedMotion, trustedSvg } from './dom.js';

function renderCell(day, state, theme, strings) {
  const cell = el('button', `cell ${state}`);
  cell.type = 'button';
  cell.dataset.day = day;
  cell.setAttribute('aria-label', `${strings.dayOfMonth(day)}, ${strings.doorState[state]}`);
  const leaf = el('span', 'leaf');
  leaf.append(el('span', 'leaf-num', String(day)));
  cell.append(el('span', 'num', String(day)), trustedSvg('ico', state === 'open' ? theme.icon(day) : ''), leaf);
  return cell;
}

export function renderGrid({ days, doors, today, theme, strings }) {
  const grid = $('grid');
  grid.dataset.days = days;
  grid.replaceChildren(...Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const cell = renderCell(day, doorState(day, doors), theme, strings);
    cell.classList.toggle('today', day === today && !cell.classList.contains('open'));
    return cell;
  }));
}

export function swingOpen(cell, delay) {
  if (!delay || prefersReducedMotion()) return Promise.resolve();
  cell.classList.add('opening');
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function shake(cell) {
  cell.classList.remove('shake');
  void cell.offsetWidth;
  cell.classList.add('shake');
}
