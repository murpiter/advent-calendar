import { drawDot } from './canvas.js';
import { svg } from './svg.js';

const ICONS = [
  svg('0 0 40 40', '<path d="M20 3L11 15h5L8 26h7L7 37h26L25 26h7L24 15h5z" fill="#6fd6b0" stroke="#3aa683" stroke-width="1.5" stroke-linejoin="round"/><rect x="18" y="36" width="4" height="3" fill="#8a5a2b"/>'),
  svg('0 0 40 40', '<path d="M2 36L15 10l7 12 5-7 11 21z" fill="#8fb4c4" stroke="#56808f" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 10l-5 9 3-2 2 3 3-3 3 5z" fill="#fff"/>'),
  svg('0 0 40 40', '<path d="M20 3c2 7 10 10 10 20a10 10 0 0 1-20 0c0-5 3-6 4-10 2 2 3 3 4 5 1-5 0-9 2-15z" fill="#ffb347" stroke="#e8861a" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 20c1 4 5 5 5 9a5 5 0 0 1-10 0c0-3 3-4 5-9z" fill="#ffe07a"/>'),
  svg('0 0 40 40', '<circle cx="20" cy="20" r="15" fill="none" stroke="#ffb347" stroke-width="2"/><path d="M20 7l4 13-4 13-4-13z" fill="#ffb347"/><path d="M20 33l-4-13h8z" fill="#e7f0ea"/><circle cx="20" cy="20" r="2" fill="#10272b"/>'),
  svg('0 0 40 40', '<path d="M26 5a15 15 0 1 0 9 26A12 12 0 0 1 26 5z" fill="#f4e9b8" stroke="#d9c77a" stroke-width="1.5" stroke-linejoin="round"/>'),
];

const PINES = [[22, 182, 56], [62, 186, 40], [309, 188, 30], [345, 184, 62], [380, 188, 42]];
const CAPS = 'M60 70l-9 9 7-2.5 4.5 4.5 5-5 7 3zM150 50l-10 11 7.5-3 5 4.5 5-4.5 7.5 3.5zM305 60l-8 8 6-2.5 4 4 4-4 6 2.5z';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function starfield() {
  const rnd = seededRandom(7);
  return Array.from({ length: 44 }, (_, i) => {
    const [x, y, r] = [rnd() * 400, rnd() * 110, rnd() * 1.1 + .3];
    return `<circle class="tw tw${i % 3}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff"/>`;
  }).join('');
}

function pine([cx, base, h]) {
  const [top, w] = [base - h, h * .42];
  const [y1, y2, y3] = [top + h * .35, top + h * .62, base - h * .12];
  const points = [[0, top], [.45, y1], [.22, y1], [.72, y2], [.4, y2], [1, y3]];
  const side = (sign) => points.map(([k, y]) => `${(cx + sign * k * w).toFixed(1)} ${y.toFixed(1)}`);
  const outline = [...side(1), ...side(-1).reverse().slice(0, -1)].join('L');
  return `<path d="M${outline}Z"/><rect x="${(cx - h * .05).toFixed(1)}" y="${y3.toFixed(1)}" width="${(h * .1).toFixed(1)}" height="${(h * .12).toFixed(1)}"/>`;
}

const CABIN = '<g transform="translate(262 152) scale(.62)">'
  + '<g fill="#cfe1e4"><circle class="puff" cx="33.5" cy="-32" r="3"/><circle class="puff" cx="33.5" cy="-32" r="3"/><circle class="puff" cx="33.5" cy="-32" r="3"/></g>'
  + '<circle class="hearth" cx="15" cy="14" r="26" fill="url(#forestWarm)"/>'
  + '<rect x="30" y="-30" width="7" height="20" fill="#050d0f"/>'
  + '<path d="M-6 0L22-24 50 0z" fill="#050d0f"/>'
  + '<path d="M-6 0L22-24 50 0" fill="none" stroke="#e7f0ea" stroke-width="2.5" stroke-linejoin="round" opacity=".85"/>'
  + '<rect width="44" height="30" fill="#08181b"/>'
  + '<rect class="hearth" x="8" y="8" width="14" height="12" rx="1" fill="#ffc46b"/>'
  + '<path d="M15 8v12M8 14h14" stroke="#08181b" stroke-width="1.6"/>'
  + '<rect x="7" y="20" width="16" height="2" fill="#e7f0ea" opacity=".8"/>'
  + '<rect x="28" y="12" width="9" height="18" fill="#050d0f"/></g>';

const DEFS = '<defs>'
  + '<linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11304a"/><stop offset="1" stop-color="#07131f"/></linearGradient>'
  + '<radialGradient id="forestWarm"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".75"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>'
  + '<filter id="forestBlur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>'
  + '<clipPath id="forestClip"><rect width="400" height="200" rx="14"/></clipPath></defs>';

function hero() {
  return svg('0 0 400 200', DEFS + '<g clip-path="url(#forestClip)">'
    + '<rect width="400" height="200" fill="url(#forestSky)"/>'
    + starfield()
    + '<path class="shoot" d="M30 24l46 12" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>'
    + '<g filter="url(#forestBlur)">'
    + '<path class="aur aur1" d="M-20 60Q90 10 200 50T420 30V80Q300 115 200 85T-20 105Z" fill="url(#aurora)"/>'
    + '<path class="aur aur2" d="M-20 85Q110 45 210 80T420 65V95Q290 120 190 100T-20 115Z" fill="url(#aurora)" opacity=".5"/></g>'
    + '<path d="M0 130L60 70l35 25 55-45 55 50 45-30 60 40 90-35V200H0Z" fill="#163a44"/>'
    + `<path d="${CAPS}" fill="#e7f0ea" opacity=".85"/>`
    + '<path d="M0 165L45 145l50 15 60-25 65 30 55-20 60 20 65-15V200H0Z" fill="#0d2528"/>'
    + `<g fill="#061214">${PINES.map(pine).join('')}</g>`
    + CABIN
    + '<path d="M0 190Q200 176 400 190V200H0Z" fill="#dfeae6"/></g>');
}

function paintFlake(ctx, f, t) {
  const glint = f.r > 3.4 && Math.sin(t / 300 + f.phase * 9) > .93;
  ctx.fillStyle = glint ? '#fff0c8' : `rgba(231,240,234,${.35 + f.kind * .18})`;
  drawDot(ctx, f.x, f.y, f.r * (glint ? 1.1 : .7));
}

const gust = (t) => Math.sin(t / 4000) * .8 + .4;

const EMBER = svg('0 0 40 40', '<circle cx="20" cy="20" r="16" fill="#ffb347" opacity=".25"/><circle cx="20" cy="20" r="8" fill="#ffb347"/><circle cx="20" cy="20" r="4" fill="#fff3c4"/>');
const SPARK = svg('0 0 40 40', '<circle cx="20" cy="20" r="14" fill="#ff7a2f" opacity=".25"/><circle cx="20" cy="20" r="5" fill="#ffcf7a"/>');

export default {
  id: 'forest',
  fonts: ['Oswald'],
  color: '#10272b',
  icon: (day) => ICONS[day % ICONS.length],
  swatch: ICONS[0],
  hero,
  snow: { count: 110, paint: paintFlake, wind: gust },
  particle: (k) => (k === 0 ? SPARK : EMBER),
  burstDelay: 80,
  openDelay: 650,
};
