import { isLocked, isOpen } from '../domain/calendar.js';
import { $, el, trustedSvg } from './dom.js';

function doorState(day, today, opened) {
  if (isOpen(day, today, opened)) return 'open';
  return isLocked(day, today) ? 'locked' : 'ready';
}

function renderCell(day, state, theme, strings) {
  const cell = el('button', `cell ${state}`);
  cell.type = 'button';
  cell.dataset.day = day;
  cell.classList.toggle('today', state === 'ready');
  cell.setAttribute('aria-label', `${strings.dayOfMonth(day)}, ${strings.doorState[state]}`);
  cell.append(el('span', 'num', String(day)), trustedSvg('ico', state === 'open' ? theme.icon(day) : ''));
  return cell;
}

export function renderGrid({ days, today, opened, theme, strings }) {
  const cells = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return renderCell(day, doorState(day, today, opened), theme, strings);
  });
  $('grid').replaceChildren(...cells);
}

export function shake(cell) {
  cell.classList.remove('shake');
  void cell.offsetWidth;
  cell.classList.add('shake');
}
