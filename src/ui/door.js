import { el, prefersReducedMotion, trustedSvg } from './dom.js';
import { button, showModal } from './modal.js';

const BURST_SIZE = 18;

function flyParticle(theme, index, origin) {
  const particle = trustedSvg('particle', theme.particle(index % 3));
  particle.style.left = `${origin.x - 9}px`;
  particle.style.top = `${origin.y - 9}px`;
  document.body.append(particle);
  const angle = Math.random() * Math.PI * 2;
  const distance = 110 + Math.random() * 150;
  const to = `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance - 30}px) scale(1.3) rotate(${Math.random() * 360}deg)`;
  particle.animate(
    [{ transform: 'translate(0,0) scale(.3)', opacity: 1 }, { transform: to, opacity: 0 }],
    { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)', delay: theme.burstDelay },
  ).onfinish = () => particle.remove();
}

function burst(theme) {
  if (prefersReducedMotion()) return;
  const origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  for (let i = 0; i < BURST_SIZE; i++) flyParticle(theme, i, origin);
}

export function openDoor({ day, text, theme, strings, fresh, returnFocus }) {
  const ok = button(strings.themes[theme.id].ok, 'btn primary');
  const content = el('div', 'content');
  content.append(trustedSvg('big', theme.icon(day)), el('div', 'date', strings.dayOfMonth(day)), el('h2', '', text), ok);
  const card = el('div');
  card.append(content);
  const close = showModal(card, { focus: ok, returnFocus });
  ok.addEventListener('click', close);
  if (fresh) burst(theme);
}
