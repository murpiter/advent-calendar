import { el } from './dom.js';
import { button, showModal } from './modal.js';

function checkbox(label) {
  const input = el('input');
  input.type = 'checkbox';
  const wrap = el('label', 'check');
  wrap.append(input, el('span', '', label));
  return { wrap, input };
}

export function openIcsDialog({ strings, onDownload, returnFocus }) {
  const showTasks = checkbox(strings.icsShowTasks);
  const save = button(strings.icsDownload, 'btn primary');
  const close = button(strings.close);
  const actions = el('div', 'actions');
  actions.append(save, close);

  const card = el('div', 'gift-card');
  card.append(el('h2', '', strings.icsHeading), el('p', 'hint', strings.icsHint), showTasks.wrap, actions);
  const hide = showModal(card, { focus: save, returnFocus });
  close.addEventListener('click', hide);
  save.addEventListener('click', () => {
    onDownload(showTasks.input.checked);
    hide();
  });
}
