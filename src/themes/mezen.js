import { svg } from './svg.js';

const RED = '#b3362a';
const SOOT = '#1d1510';
const WOOD = '#f6e4bc';

const place = (x, y, art, extra = '') => `<g transform="translate(${x} ${y}) ${extra}">${art}</g>`;

function petal(r, angle, color) {
  return `<path transform="rotate(${angle})" d="M0 ${-r * .22}C${r * .2} ${-r * .45} ${r * .14} ${-r * .78} 0 ${-r * .92}`
    + `C${-r * .14} ${-r * .78} ${-r * .2} ${-r * .45} 0 ${-r * .22}Z" fill="${color}"/>`;
}

function sun(r, { petals = 12, spin = '' } = {}) {
  const step = 360 / petals;
  const rays = Array.from({ length: petals }, (_, i) => petal(r, i * step, i % 2 ? SOOT : RED)
    + `<path transform="rotate(${i * step + step / 2})" d="M0 ${-r * .6}V${-r * .88}" stroke="${SOOT}" stroke-width="${r * .04}" stroke-linecap="round"/>`);
  return `<g class="${spin}"><circle r="${r}" fill="${WOOD}" stroke="${SOOT}" stroke-width="${r * .05}"/>${rays.join('')}`
    + `<circle r="${r * .2}" fill="${RED}" stroke="${SOOT}" stroke-width="${r * .04}"/>`
    + `<path d="M${-r * .12} 0H${r * .12}M0 ${-r * .12}V${r * .12}" stroke="${WOOD}" stroke-width="${r * .05}"/></g>`;
}

const horse = (gait = '') => `<g class="trot ${gait}">`
  + `<path d="M8 31C3 31 1 36 3 42M8 29C1 26-2 33 0 39" fill="none" stroke="${SOOT}" stroke-width="1.4" stroke-linecap="round"/>`
  + `<path d="M14 32L10 47M19 33L19 48M38 33L42 47M34 34L35 48" stroke="${SOOT}" stroke-width="1.6" stroke-linecap="round"/>`
  + `<path d="M8 47h4M17 48h4M40 47h4M33 48h4" stroke="${SOOT}" stroke-width="2" stroke-linecap="round"/>`
  + `<path d="M8 26C12 20 32 19 41 22C45 24 45 31 41 33C33 37 15 37 9 33C6 31 6 28 8 26Z" fill="${RED}" stroke="${SOOT}" stroke-width="1.3"/>`
  + `<path d="M13 27h26M13 31h26M15 27v4M18 27v4M21 27v4M24 27v4M27 27v4M30 27v4M33 27v4M36 27v4" stroke="${SOOT}" stroke-width=".8"/>`
  + `<path d="M38 23C41 15 43 9 47 5L53 6L56 10L54 12L49 11C47 16 46 22 44 27Z" fill="${RED}" stroke="${SOOT}" stroke-width="1.3"/>`
  + `<path d="M46 5l1-4 2 4" fill="${SOOT}"/><circle cx="51" cy="7.6" r=".9" fill="${WOOD}"/>`
  + `<path d="M40 18c-3-1-5 0-6 2M41 14c-3-1-5 0-6 2M43 10c-3-1-5 0-6 2" fill="none" stroke="${SOOT}" stroke-width="1.2" stroke-linecap="round"/></g>`;

const BIRD = '<g class="bird">'
  + `<path d="M0 10C3 5 13 5 17 8L22 4L25 6L19 11C17 16 5 17 0 10Z" fill="${RED}" stroke="${SOOT}" stroke-width="1"/>`
  + `<circle cx="21.5" cy="5.6" r=".7" fill="${WOOD}"/><path d="M-1 10l-4-2m4 3l-4 1" stroke="${SOOT}" stroke-width="1" stroke-linecap="round"/>`
  + `<path class="wing" d="M5 9C7 2 12 0 15 1C12 3 11 6 11 9Z" fill="${SOOT}"/></g>`;

const DEER = `<g><path d="M6 20L4 30M10 21L10 31M22 21L25 30M19 21L19 31M4 16l-3-2" stroke="${SOOT}" stroke-width="1.3" stroke-linecap="round"/>`
  + `<path d="M4 16C8 12 20 12 25 15C27 17 26 21 23 22C17 24 8 24 5 21C3 20 3 18 4 16Z" fill="${RED}" stroke="${SOOT}" stroke-width="1"/>`
  + `<path d="M8 16v5M11 15v6M14 15v6M17 15v6M20 16v5" stroke="${SOOT}" stroke-width=".7"/>`
  + `<g class="nod"><path d="M23 15C25 10 27 7 30 6L33 8L30 10C28 12 27 15 26 18Z" fill="${RED}" stroke="${SOOT}" stroke-width="1"/>`
  + `<path d="M29 6L27 0M28 3L25 1M29 6L33 0M31 3L34 2" stroke="${SOOT}" stroke-width="1" stroke-linecap="round"/></g></g>`;

function tree(height) {
  const twigs = Array.from({ length: Math.floor(height / 4) }, (_, i) => {
    const y = 3 + i * 4;
    const w = 2 + i * 1.3;
    return `<path d="M0 ${y}L${-w} ${y + 3}M0 ${y}L${w} ${y + 3}" stroke="${i % 2 ? RED : SOOT}" stroke-width="1.3" stroke-linecap="round"/>`;
  });
  return `<g><path d="M0 0V${height}" stroke="${SOOT}" stroke-width="1.3"/>${twigs.join('')}</g>`;
}

const RHOMB = `<path d="M10-8L28 10L10 28L-8 10Z" fill="${WOOD}" stroke="${SOOT}" stroke-width="1.4"/>`
  + `<path d="M10 0L20 10L10 20L0 10Z" fill="${RED}" stroke="${SOOT}" stroke-width="1.2"/><path d="M4 10H16M10 4V16" stroke="${WOOD}" stroke-width="1.6"/>`
  + `<g fill="${SOOT}"><circle cx="10" cy="-3" r="1.6"/><circle cx="10" cy="23" r="1.6"/><circle cx="-3" cy="10" r="1.6"/><circle cx="23" cy="10" r="1.6"/></g>`;

const MOTIFS = [
  svg('-2 -4 60 56', horse()),
  svg('-8 -4 36 26', BIRD),
  svg('-2 -2 38 36', DEER),
  svg('-22 -22 44 44', sun(20)),
  svg('-14 -2 28 34', tree(30)),
  svg('-10 -10 40 40', RHOMB),
];
const motif = (index) => MOTIFS[index % MOTIFS.length];

function zigzag(from, to, y, height, color) {
  const points = [];
  for (let x = from, up = true; x < to; x += 6, up = !up) points.push(`L${x + 6} ${y + (up ? -height : height) / 2}`);
  return `<path d="M${from} ${y}${points.join('')}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/>`;
}

function ladder(from, to, y) {
  const rungs = [];
  for (let x = from + 2; x < to; x += 4) rungs.push(`M${x} ${y - 3}v6`);
  return `<path d="M${from} ${y - 3}H${to}M${from} ${y + 3}H${to}" stroke="${SOOT}" stroke-width="1"/>`
    + `<path d="${rungs.join('')}" stroke="${SOOT}" stroke-width=".8"/>`;
}

function rhombRow(from, y, count) {
  return Array.from({ length: count }, (_, i) => {
    const x = from + i * 20;
    return `<path d="M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}Z" fill="${i % 2 ? RED : WOOD}" stroke="${SOOT}" stroke-width="1"/>`
      + `<circle class="flick" cx="${x}" cy="${y}" r="1.8" fill="${i % 2 ? WOOD : RED}"/><path d="M${x + 10} ${y - 4}v8" stroke="${SOOT}" stroke-width="1"/>`;
  }).join('');
}

const range = (count, toArt) => Array.from({ length: count }, (_, i) => toArt(i)).join('');

const BOARD = 'M10 248V58C10 26 40 8 70 8H330C360 8 390 26 390 58V248Z';
const DEFS = '<defs><linearGradient id="mezBoard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e4bc"/><stop offset="1" stop-color="#ecd2a0"/></linearGradient>'
  + '<pattern id="mezGrain" width="400" height="9" patternUnits="userSpaceOnUse"><path d="M0 4C80 2 160 7 240 4S360 2 400 5" fill="none" stroke="#c99a5a" stroke-opacity=".18" stroke-width=".8"/></pattern></defs>';

const SKY_TIER = zigzag(40, 360, 24, 5, RED)
  + range(6, (i) => place(50 + i * 56, 32 + (i % 2) * 6, BIRD))
  + range(5, (i) => place(90 + i * 56, 44 - (i % 2) * 4, sun(6, { spin: 'rot fast' })));

const SUN_TIER = place(200, 118, sun(40, { spin: 'rot' }))
  + place(200, 118, `<circle class="rot back" r="46" fill="none" stroke="${RED}" stroke-width="1.5" stroke-dasharray="2 4"/>`)
  + place(84, 92, horse()) + place(316, 92, horse('late'), 'scale(-1 1)')
  + place(40, 82, tree(30)) + place(360, 82, tree(30)) + place(150, 128, tree(18)) + place(250, 128, tree(18))
  + place(46, 136, sun(9, { petals: 8, spin: 'rot fast' })) + place(354, 136, sun(9, { petals: 8, spin: 'rot fast back' }));

const FOREST_TIER = rhombRow(36, 182, 17) + zigzag(22, 378, 197, 5, RED)
  + range(4, (i) => place(48 + i * 90, 206, DEER)) + range(4, (i) => place(100 + i * 90, 208, tree(26)));

function hero() {
  return svg('0 0 400 250', DEFS
    + `<path d="${BOARD}" fill="url(#mezBoard)" stroke="${SOOT}" stroke-width="2.5"/><path d="${BOARD}" fill="url(#mezGrain)"/>`
    + `<path d="M18 248V60C18 32 44 16 72 16H328C356 16 382 32 382 60V248" fill="none" stroke="${RED}" stroke-width="2"/>`
    + SKY_TIER + ladder(22, 378, 66) + SUN_TIER + ladder(22, 378, 166) + FOREST_TIER + ladder(22, 378, 242));
}

const SNOW_COLORS = ['rgba(179,54,42,.75)', 'rgba(29,21,16,.55)'];

function paintCross(ctx, f, angle) {
  const r = f.r * 1.4;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(angle);
  ctx.strokeStyle = SNOW_COLORS[f.kind];
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let arm = 0; arm < 4; arm++) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    ctx.moveTo(-r * .3, -r * .7);
    ctx.lineTo(0, -r * .45);
    ctx.lineTo(r * .3, -r * .7);
    ctx.rotate(Math.PI / 2);
  }
  ctx.stroke();
  ctx.restore();
}

function paintFlake(ctx, f, t) {
  if (f.kind < 2) return paintCross(ctx, f, t / 2000 + f.phase);
  ctx.fillStyle = 'rgba(179,54,42,.7)';
  ctx.beginPath();
  ctx.arc(f.x, f.y, f.r * .6, 0, Math.PI * 2);
  ctx.fill();
}

const crossBit = (color) => svg('-10 -10 20 20', `<path d="M-8 0H8M0-8V8" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`);
const PARTICLES = [svg('-22 -22 44 44', sun(20, { petals: 8 })), crossBit(RED), crossBit(SOOT)];

export default {
  id: 'mezen',
  fonts: ['Ruslan Display', 'Cormorant Garamond'],
  color: '#ecd09a',
  icon: (day) => motif(day + 2),
  door: (day) => motif(day - 1),
  swatch: MOTIFS[0],
  hero,
  snow: { count: 46, paint: paintFlake },
  particle: (k) => PARTICLES[k],
  burstDelay: 60,
  openDelay: 700,
};
