import { el } from './dom.js';
import { button, showModal } from './modal.js';

const isInstalled = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isAppleTouch = () => /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);

function showAppleHint(strings, returnFocus) {
  const close = button(strings.close, 'btn primary');
  const card = el('div', 'gift-card');
  card.append(el('h2', '', strings.installHeading), el('p', '', strings.installApple), close);
  const hide = showModal(card, { focus: close, returnFocus });
  close.addEventListener('click', hide);
}

export function setupInstall(installButton, getStrings) {
  if (isInstalled()) return;
  let prompt = null;
  const reveal = () => { installButton.hidden = false; };
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    prompt = event;
    reveal();
  });
  window.addEventListener('appinstalled', () => { installButton.hidden = true; });
  installButton.addEventListener('click', async () => {
    if (!prompt) return showAppleHint(getStrings(), installButton);
    prompt.prompt();
    await prompt.userChoice;
    prompt = null;
    installButton.hidden = true;
  });
  if (isAppleTouch()) reveal();
}
