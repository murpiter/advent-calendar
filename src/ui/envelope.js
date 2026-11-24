import { $, el, trustedSvg } from './dom.js';
import { button } from './modal.js';

export function renderEnvelope({ gift, theme, strings, replacing }) {
  const open = button(strings.openGift, 'btn primary');
  const later = button(strings.later);
  const actions = el('div', 'actions');
  actions.append(open, later);

  const card = el('div', 'panel envelope');
  card.append(trustedSvg('big', theme.swatch), el('h2', '', strings.envelopeHeading));
  if (gift.from) card.append(el('p', 'from', strings.envelopeFrom(gift.from)));
  if (gift.note) card.append(el('p', 'letter', gift.note));
  if (replacing) card.append(el('p', 'hint', strings.replaceWarning));
  card.append(actions);

  $('viewGift').replaceChildren(card);
  open.focus();
  return { open, later };
}
