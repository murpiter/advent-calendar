import { drawDot } from './canvas.js';
import { svg } from './svg.js';

const ICONS = [
  svg('0 0 40 40', '<path d="M20 3L11 15h5L8 26h7L7 37h26L25 26h7L24 15h5z" fill="#6fd6b0" stroke="#3aa683" stroke-width="1.5" stroke-linejoin="round"/><rect x="18" y="36" width="4" height="3" fill="#8a5a2b"/>'),
  svg('0 0 40 40', '<path d="M2 36L15 10l7 12 5-7 11 21z" fill="#8fb4c4" stroke="#56808f" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 10l-5 9 3-2 2 3 3-3 3 5z" fill="#fff"/>'),
  svg('0 0 40 40', '<path d="M20 3c2 7 10 10 10 20a10 10 0 0 1-20 0c0-5 3-6 4-10 2 2 3 3 4 5 1-5 0-9 2-15z" fill="#ffb347" stroke="#e8861a" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 20c1 4 5 5 5 9a5 5 0 0 1-10 0c0-3 3-4 5-9z" fill="#ffe07a"/>'),
  svg('0 0 40 40', '<circle cx="20" cy="20" r="15" fill="none" stroke="#ffb347" stroke-width="2"/><path d="M20 7l4 13-4 13-4-13z" fill="#ffb347"/><path d="M20 33l-4-13h8z" fill="#e7f0ea"/><circle cx="20" cy="20" r="2" fill="#10272b"/>'),
  svg('0 0 40 40', '<path d="M26 5a15 15 0 1 0 9 26A12 12 0 0 1 26 5z" fill="#f4e9b8" stroke="#d9c77a" stroke-width="1.5" stroke-linejoin="round"/>'),
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function starfield() {
  const rnd = seededRandom(7);
  return Array.from({ length: 46 }, () => {
    const [x, y, r, o] = [rnd() * 400, rnd() * 120, rnd() * 1.2 + .3, rnd() * .6 + .3];
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${o.toFixed(2)}"/>`;
  }).join('');
}

function pine(x, y, scale) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="#071619"><path d="M0-50L-12-28h7L-16-8h9L-20 14H20L7-8h9L5-28h7z"/><rect x="-3" y="14" width="6" height="8"/></g>`;
}

function hero() {
  return svg('0 0 400 240',
    '<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a2e"/><stop offset="1" stop-color="#16424a"/></linearGradient><filter id="bl"><feGaussianBlur stdDeviation="4"/></filter></defs>'
    + '<rect width="400" height="240" rx="14" fill="url(#skyG)"/>'
    + starfield()
    + '<path d="M0 78Q90 18 190 66T400 44V112Q300 144 200 104T0 126Z" fill="url(#aurora)" opacity=".55"/>'
    + '<path d="M0 110Q110 56 210 100T400 84V120Q290 150 190 120T0 140Z" fill="url(#aurora)" opacity=".3"/>'
    + '<circle cx="330" cy="46" r="17" fill="#f4e9b8"/><circle cx="338" cy="41" r="15" fill="#0d2430"/>'
    + '<path d="M0 190L70 112l50 52 70-80 70 86 60-48 80 66V240H0Z" fill="#1c4047"/>'
    + '<path d="M70 112l-14 14 10-4 8 8 8-8 10 5z M190 84l-16 18 12-5 8 7 8-8 12 6z" fill="#e7f0ea" opacity=".85"/>'
    + '<path d="M0 238V196L60 170 120 204 200 160 280 208 340 176 400 204V238Z" fill="#0d2528"/>'
    + pine(40, 196, 1.05) + pine(88, 206, .8) + pine(318, 198, 1.15) + pine(362, 208, .85) + pine(268, 214, .7)
    + '<g><rect x="168" y="196" width="46" height="30" fill="#071619"/><path d="M162 198l29-24 29 24z" fill="#050f11"/><rect x="184" y="206" width="12" height="12" fill="#ffb347"/><rect x="184" y="206" width="12" height="12" fill="#ffb347" opacity=".5" filter="url(#bl)"/></g>');
}

function paintFlake(ctx, f) {
  ctx.fillStyle = `rgba(231,240,234,${.35 + f.kind * .18})`;
  drawDot(ctx, f.x, f.y, f.r * .75);
}

const EMBER = svg('0 0 40 40', '<circle cx="20" cy="20" r="9" fill="#ffb347"/>');
const SNOWBALL = svg('0 0 40 40', '<circle cx="20" cy="20" r="7" fill="#e7f0ea"/>');

export default {
  id: 'forest',
  fonts: ['Oswald', 'Barlow'],
  icon: (day) => ICONS[day % ICONS.length],
  swatch: ICONS[0],
  hero,
  snow: { count: 80, paint: paintFlake },
  particle: (k) => (k === 0 ? EMBER : SNOWBALL),
  burstDelay: 80,
};
