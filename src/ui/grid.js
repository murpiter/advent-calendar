import { doorState } from '../domain/calendar.js';
import { $, el, trustedSvg } from './dom.js';

function renderCell(day, state, theme, strings) {
  const cell = el('button', `cell ${state}`);
  cell.type = 'button';
  cell.dataset.day = day;
  cell.setAttribute('aria-label', `${strings.dayOfMonth(day)}, ${strings.doorState[state]}`);
  cell.append(el('span', 'num', String(day)), trustedSvg('ico', state === 'open' ? theme.icon(day) : ''));
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

export function shake(cell) {
  cell.classList.remove('shake');
  void cell.offsetWidth;
  cell.classList.add('shake');
}
