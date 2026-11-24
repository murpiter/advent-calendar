import { prefersReducedMotion } from './dom.js';

function makeFlakes(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 1.2,
    speed: Math.random() * .7 + .35,
    phase: Math.random() * Math.PI * 2,
    kind: Math.floor(Math.random() * 3),
  }));
}

function drift(flake, t, wind, { width, height }) {
  flake.y += flake.speed;
  flake.x = (flake.x + Math.sin(t / 1200 + flake.phase) * .35 + wind + width) % width;
  if (flake.y > height + 10) {
    flake.y = -10;
    flake.x = Math.random() * width;
  }
}

export function createSnow(canvas) {
  const ctx = canvas.getContext('2d');
  const still = prefersReducedMotion();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let size = { width: 0, height: 0 };
  let flakes = [];
  let theme = null;

  function draw(t) {
    ctx.clearRect(0, 0, size.width, size.height);
    const wind = theme.snow.wind?.(t) ?? 0;
    for (const flake of flakes) {
      if (!still) drift(flake, t, wind, size);
      theme.snow.paint(ctx, flake, t);
    }
  }

  function resize() {
    size = { width: window.innerWidth, height: window.innerHeight };
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (still && theme) draw(0);
  }

  function setTheme(next) {
    theme = next;
    flakes = makeFlakes(theme.snow.count, size.width, size.height);
    if (still) draw(0);
  }

  function loop(t) {
    draw(t);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  if (!still) requestAnimationFrame(loop);
  return { setTheme };
}
