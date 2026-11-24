import { $, el } from './dom.js';

export function showModal(card, { focus, returnFocus } = {}) {
  const root = $('modalRoot');
  const overlay = el('div', 'overlay');
  card.classList.add('mcard');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  overlay.append(card);
  root.replaceChildren(overlay);

  const onKey = (event) => event.key === 'Escape' && close();
  function close() {
    root.replaceChildren();
    document.removeEventListener('keydown', onKey);
    returnFocus?.focus();
  }

  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', (event) => event.target === overlay && close());
  focus?.focus();
  return close;
}

export function button(text, className = 'btn') {
  const node = el('button', className, text);
  node.type = 'button';
  return node;
}
