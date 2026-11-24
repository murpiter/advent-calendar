import { drawDot } from './canvas.js';
import { svg } from './svg.js';

const ICING = '#fffaf3';
const RED = '#e2363f';
const CHOC = '#4a2616';
const GINGER = '#c47a3d';
const GINGER_DARK = '#9a5427';
const CANDY = ['#e2363f', '#7fd3b4', '#ffd257', '#ff9fb6', '#9c7bff'];

const at = (x, y, art) => `<g transform="translate(${x} ${y})">${art}</g>`;

function mint(r, spin = '') {
  const stripes = [0, 90, 180, 270].map((angle) => `<path transform="rotate(${angle})" d="M0 0C${r * .5} ${-r * .1} ${r * .8} ${-r * .45} ${r * .92} ${-r * .3}`
    + `A${r * .92} ${r * .92} 0 0 0 ${r * .65} ${-r * .65}C${r * .4} ${-r * .5} ${r * .1} ${-r * .3} 0 0Z" fill="${RED}"/>`);
  return `<g class="${spin}"><circle r="${r}" fill="${ICING}" stroke="${RED}" stroke-width="${r * .08}"/>${stripes.join('')}`
    + `<circle r="${r * .14}" fill="${ICING}"/><circle cx="${-r * .35}" cy="${-r * .4}" r="${r * .16}" fill="#fff" opacity=".7"/></g>`;
}

function swirl(r) {
  const points = Array.from({ length: 60 }, (_, i) => {
    const angle = (i + 1) * .35;
    const radius = (i + 1) * r / 60;
    return `L${(Math.cos(angle) * radius).toFixed(1)} ${(Math.sin(angle) * radius).toFixed(1)}`;
  });
  return `M0 0${points.join('')}`;
}

const lollipop = (r, color, spin = '') => `<g class="${spin}"><circle r="${r}" fill="${ICING}"/>`
  + `<path d="${swirl(r)}" fill="none" stroke="${color}" stroke-width="${r * .22}" stroke-linecap="round"/>`
  + `<circle cx="${-r * .4}" cy="${-r * .4}" r="${r * .18}" fill="#fff" opacity=".6"/></g>`;

const cane = (x, y, h, flip) => `<g transform="translate(${x} ${y}) scale(${flip} 1)">`
  + `<path d="M0 0V${-h}a8 8 0 0 1 16 0" fill="none" stroke="${ICING}" stroke-width="7" stroke-linecap="round"/>`
  + `<path d="M0 0V${-h}a8 8 0 0 1 16 0" fill="none" stroke="${RED}" stroke-width="7" stroke-dasharray="5 6"/></g>`;

const gumdrop = (x, y, r, color) => `<g class="gum"><path d="M${x - r} ${y}a${r} ${r * 1.05} 0 0 1 ${r * 2} 0z" fill="${color}"/>`
  + `<circle cx="${x - r * .35}" cy="${y - r * .55}" r="${r * .2}" fill="#fff" opacity=".7"/>`
  + `<g fill="#fff" opacity=".8"><circle cx="${x + r * .3}" cy="${y - r * .3}" r=".9"/><circle cx="${x - r * .1}" cy="${y - r * .2}" r=".8"/></g></g>`;

const sparkle = ([x, y, r]) => `<path class="twinkle" d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}`
  + `Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}z" fill="#fff3c4"/>`;

function drips(from, to, y, step) {
  const parts = [];
  for (let x = from; x < to; x += step) {
    const depth = 4 + ((x * 7) % 9);
    parts.push(`Q${x + step * .25} ${y} ${x + step * .3} ${y + depth}a${step * .2} ${step * .2} 0 0 0 ${step * .4} 0Q${x + step * .75} ${y} ${x + step} ${y}`);
  }
  return `M${from} ${y}${parts.join('')}`;
}

const GINGERBREAD_MAN = `<path d="M-12-40a12 12 0 1 1 24 0a12 12 0 0 1-3 8h9a6 6 0 0 1 0 12h-8v10l7 10a6 6 0 0 1-10 6l-7-10-7 10a6 6 0 0 1-10-6l7-10v-10h-8a6 6 0 0 1 0-12h9a12 12 0 0 1-3-8z" fill="${GINGER}" stroke="${GINGER_DARK}" stroke-width="1.5"/>`
  + `<circle cx="-4" cy="-42" r="1.8" fill="${CHOC}"/><circle cx="4" cy="-42" r="1.8" fill="${CHOC}"/>`
  + `<path d="M-5-36q5 4 10 0M-14-26h3M-17-23h3M11-26h3M14-23h3M-8 2l3 3M8 2l-3 3" fill="none" stroke="${ICING}" stroke-width="2" stroke-linecap="round"/>`
  + `<circle cy="-22" r="2.2" fill="${RED}"/><circle cy="-15" r="2.2" fill="#7fd3b4"/>`;

const DEFS = '<defs><linearGradient id="gbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1636"/><stop offset=".6" stop-color="#6a2c4a"/><stop offset="1" stop-color="#b65a4a"/></linearGradient>'
  + '<radialGradient id="gbLamp"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#ffc35a"/><stop offset="1" stop-color="#ff9a3a"/></radialGradient>'
  + '<radialGradient id="gbHalo"><stop offset="0" stop-color="#ffc35a" stop-opacity=".55"/><stop offset="1" stop-color="#ffc35a" stop-opacity="0"/></radialGradient>'
  + `<pattern id="gbShingle" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#8a4a22"/><path d="M0 12a8 8 0 0 1 16 0" fill="#a85a2a" stroke="${ICING}" stroke-width="1.4"/></pattern>`
  + '<clipPath id="gbBite"><path d="M0 0H400V250H0Z M82 38a10 10 0 1 0 .1 0z" clip-rule="evenodd"/></clipPath></defs>';

const SKY = '<rect width="400" height="250" fill="url(#gbSky)"/>'
  + [[120, 30, 5], [300, 22, 4], [350, 70, 5], [30, 100, 3.5], [160, 70, 3], [260, 50, 3.5], [380, 120, 3]].map(sparkle).join('')
  + `<g clip-path="url(#gbBite)"><circle cx="64" cy="50" r="22" fill="#f3c98a"/><circle cx="64" cy="50" r="17" fill="none" stroke="${ICING}" stroke-width="2" stroke-dasharray="3 3"/>`
  + `<g fill="${CHOC}"><circle cx="57" cy="46" r="2"/><circle cx="68" cy="56" r="2"/><circle cx="60" cy="58" r="1.6"/></g></g>`
  + '<circle cx="200" cy="140" r="120" fill="url(#gbHalo)"/><path d="M0 206C60 188 120 196 200 204S330 186 400 200V250H0Z" fill="#f6e9e6"/>';

const LOLLIPOP_TREES = at(68, 206, `<path d="M0 0V-58" stroke="${ICING}" stroke-width="4"/>${at(0, -72, lollipop(18, '#ff6fa0', 'spin'))}`)
  + at(345, 206, `<path d="M0 0V-46" stroke="${ICING}" stroke-width="4"/>${at(0, -58, lollipop(14, '#7fd3b4', 'spin back'))}`);

const CHIMNEY = at(250, 64, `<rect x="-9" width="18" height="40" fill="#a85a2a" stroke="${ICING}" stroke-width="2"/><path d="M-12 0h24" stroke="${ICING}" stroke-width="5" stroke-linecap="round"/>`
  + '<g fill="#fff" opacity=".9"><circle class="puff" cy="-8" r="6"/><circle class="puff" cy="-8" r="6"/><circle class="puff" cy="-8" r="6"/></g>');

const windowPane = (x, late) => `<circle cx="${x}" cy="160" r="26" fill="url(#gbHalo)" class="glow ${late}"/>`
  + `<path d="M${x - 12} 176v-18a12 12 0 0 1 24 0v18z" fill="url(#gbLamp)" class="glow ${late}" stroke="${ICING}" stroke-width="3"/>`
  + `<path d="M${x} 146v30M${x - 12} 162h24M${x - 16} 180h32" stroke="${ICING}" stroke-width="2.5"/>`;

const HOUSE = '<rect x="132" y="118" width="136" height="96" fill="#c47a3d" stroke="#9a5427" stroke-width="2"/>'
  + `<path d="M132 118h136v96H132z" fill="none" stroke="${ICING}" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>`
  + `<path d="M200 46L112 126H288Z" fill="url(#gbShingle)" stroke="${GINGER_DARK}" stroke-width="2"/>`
  + `<path d="M200 40L104 126M200 40L296 126" stroke="${ICING}" stroke-width="9" stroke-linecap="round"/>`
  + `<path d="${drips(104, 296, 126, 12)}V130H104Z" fill="${ICING}"/>`
  + Array.from({ length: 8 }, (_, i) => gumdrop(124 + i * 22, 132, 6, CANDY[i % CANDY.length])).join('')
  + at(200, 82, mint(11, 'spin'))
  + windowPane(158, '') + windowPane(242, 'late')
  + `<path d="M184 214v-30a16 16 0 0 1 32 0v30z" fill="#7a2f1f" stroke="${ICING}" stroke-width="3"/>`
  + '<circle cx="200" cy="186" r="5" fill="url(#gbLamp)" class="glow"/><circle cx="210" cy="200" r="2" fill="#ffd257"/>'
  + cane(172, 214, 34, -1) + cane(228, 214, 34, 1);

const YARD = `<path d="M0 214C80 206 150 212 200 216S330 204 400 212V250H0Z" fill="${ICING}"/>`
  + `<path d="M186 250L192 216H208L214 250Z" fill="#ffd9e4"/><g fill="${RED}" opacity=".5"><circle cx="196" cy="226" r="1.6"/><circle cx="204" cy="236" r="1.6"/><circle cx="198" cy="244" r="1.6"/></g>`
  + gumdrop(108, 216, 9, '#7fd3b4') + gumdrop(124, 218, 7, '#ff9fb6') + gumdrop(276, 218, 8, '#ffd257') + gumdrop(290, 219, 6, '#9c7bff')
  + at(40, 232, mint(9, 'spin back')) + at(150, 236, mint(7, 'spin')) + at(370, 234, mint(8, 'spin'))
  + '<g transform="translate(250 236) rotate(-12)"><rect x="-9" y="-5" width="18" height="10" rx="5" fill="#9c7bff"/><path d="M-9 0l-7-5v10zM9 0l7-5v10z" fill="#c9b5ff"/></g>'
  + at(316, 214, `<g class="hop">${GINGERBREAD_MAN}</g>`);

const hero = () => svg('0 0 400 250', DEFS + SKY + LOLLIPOP_TREES + CHIMNEY + HOUSE + YARD);

const DECORATIONS = [
  svg('-20 -20 40 40', mint(18)),
  svg('-20 -24 40 40', gumdrop(0, 12, 16, '#7fd3b4')),
  svg('-20 -20 40 40', `<path d="M0 16C-16 4-16-8-9-12c4-2 7 0 9 4 2-4 5-6 9-4 7 4 7 16-9 28z" fill="#ff9fb6" stroke="${ICING}" stroke-width="2.5"/>`
    + '<g stroke-width="2.2" stroke-linecap="round"><path d="M-6-4l2 2" stroke="#ffd257"/><path d="M4-2l2-2" stroke="#7fd3b4"/><path d="M-1 6l2 1" stroke="#9c7bff"/></g>'),
  svg('-20 -20 40 40', `<path d="M0-17l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="#ffd257" stroke="${ICING}" stroke-width="2.5" stroke-linejoin="round"/>`),
  svg('-20 -20 40 40', '<path d="M-2-6C-2-14 4-18 10-17" fill="none" stroke="#3d7a3a" stroke-width="2"/><path d="M4-15c4-3 9-2 11 1-4 2-8 2-11-1z" fill="#5fb35a"/>'
    + `<circle cx="-4" cy="4" r="11" fill="${RED}" stroke="${ICING}" stroke-width="2"/><circle cx="-8" r="3" fill="#fff" opacity=".6"/>`),
];

const TREATS = [
  svg('-20 -20 40 40', `${at(0, -4, lollipop(12, '#ff6fa0'))}<path d="M0 8V20" stroke="${ICING}" stroke-width="3"/>`),
  svg('-20 -22 40 44', `<path d="M-14 2h28l-4 18h-20z" fill="#ff9fb6" stroke="${CHOC}" stroke-width="1.5"/><path d="M-8 2l1 18M0 2v18M8 2l-1 18" stroke="${CHOC}" stroke-width="1" opacity=".4"/>`
    + `<path d="M-15 3c-4-10 6-14 8-10 2-8 14-8 15 0 4-4 12 2 7 10z" fill="${ICING}" stroke="#e8d3c2" stroke-width="1.5"/><circle cy="-12" r="4" fill="${RED}"/>`
    + '<g stroke-width="2" stroke-linecap="round"><path d="M-8-3l2 1" stroke="#7fd3b4"/><path d="M5-4l2-1" stroke="#ffd257"/></g>'),
  svg('-20 -24 40 48', `<g transform="translate(0 20) scale(.85)">${GINGERBREAD_MAN}</g>`),
  svg('-20 -20 40 40', `<circle r="16" fill="#e8a25e" stroke="${CHOC}" stroke-width="1.5"/><circle r="6" fill="#f0d6e8"/>`
    + '<path d="M-15-3a15 15 0 0 1 30 0c-3 4-6 1-8 4s-5 1-7 3-5-2-8 0-5-3-7-7z" fill="#ff6fa0"/>'
    + `<g stroke-width="2" stroke-linecap="round"><path d="M-9-8l2 1" stroke="${ICING}"/><path d="M6-9l2-1" stroke="#ffd257"/><path d="M9-2l1 2" stroke="#7fd3b4"/><path d="M-4-12h2" stroke="#9c7bff"/></g>`),
  svg('-20 -20 40 40', `<g transform="rotate(-20)"><rect x="-11" y="-7" width="22" height="14" rx="7" fill="#ffd257" stroke="${CHOC}" stroke-width="1.2"/>`
    + `<path d="M-11 0l-9-7v14zM11 0l9-7v14z" fill="#ffe89a" stroke="${CHOC}" stroke-width="1.2"/><path d="M-4-7v14M4-7v14" stroke="${RED}" stroke-width="2"/></g>`),
  svg('-20 -20 40 40', `<path d="M-14 6h28v4a4 4 0 0 1-4 4h-20a4 4 0 0 1-4-4z" fill="#b9e6ff" stroke="${CHOC}" stroke-width="1.2"/>`
    + `<rect x="-15" y="-4" width="30" height="5" rx="2.5" fill="${ICING}" stroke="${CHOC}" stroke-width="1"/>`
    + `<path d="M-14-4c0-8 6-12 14-12s14 4 14 12" fill="#ff9fb6" stroke="${CHOC}" stroke-width="1.2"/>`),
];

function paintFlake(ctx, f, t) {
  if (f.kind < 2) {
    ctx.fillStyle = 'rgba(255,250,243,.9)';
    return drawDot(ctx, f.x, f.y, f.r * .8);
  }
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(t / 900 + f.phase);
  ctx.fillStyle = CANDY[Math.floor(f.phase * 10) % CANDY.length];
  ctx.beginPath();
  ctx.roundRect(-5, -1.6, 10, 3.2, 1.6);
  ctx.fill();
  ctx.restore();
}

const PARTICLES = [
  svg('-20 -20 40 40', mint(18)),
  svg('0 0 10 10', `<circle cx="5" cy="5" r="4" fill="${GINGER}"/>`),
  svg('0 0 16 16', `<rect y="5" width="16" height="6" rx="3" fill="${CANDY[3]}"/>`),
];

export default {
  id: 'gingerbread',
  fonts: ['Lobster', 'Nunito'],
  color: '#2b1636',
  icon: (day) => TREATS[(day * 5) % TREATS.length],
  door: (day) => DECORATIONS[(day - 1) % DECORATIONS.length],
  swatch: TREATS[2],
  hero,
  snow: { count: 90, paint: paintFlake },
  particle: (k) => PARTICLES[k],
  burstDelay: 40,
  openDelay: 650,
};
