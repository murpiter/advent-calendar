import { el } from './dom.js';
import { button } from './modal.js';

export function showUpdateBar(strings, apply) {
  if (document.querySelector('.update-bar')) return;
  const bar = el('div', 'update-bar');
  bar.setAttribute('role', 'status');
  const reload = button(strings.updateReload, 'btn primary');
  reload.addEventListener('click', () => {
    reload.disabled = true;
    apply();
  });
  bar.append(el('span', '', strings.updateReady), reload);
  document.body.append(bar);
}
