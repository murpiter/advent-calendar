import { drawDot } from './canvas.js';
import { svg } from './svg.js';

const INK = '#6b4a63';
const OUTLINE = `stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"`;
const SKIN = 'stroke="#f0c9da" stroke-width="2.5"';

function eye(x, y, s) {
  return `<ellipse cx="${x}" cy="${y}" rx="${1.9 * s}" ry="${2.5 * s}" fill="${INK}"/>`
    + `<circle cx="${x - .7 * s}" cy="${y - s}" r="${.8 * s}" fill="#fff"/>`;
}

function face(x, y, s) {
  return eye(x - 5 * s, y, s) + eye(x + 5 * s, y, s)
    + `<g fill="#ff9cc2" opacity=".7"><circle cx="${x - 8.5 * s}" cy="${y + 3.5 * s}" r="${2.2 * s}"/><circle cx="${x + 8.5 * s}" cy="${y + 3.5 * s}" r="${2.2 * s}"/></g>`
    + `<path d="M${x - 2 * s} ${y + 3 * s}q${s} ${1.6 * s} ${2 * s} 0q${s} ${1.6 * s} ${2 * s} 0" fill="none" stroke="${INK}" stroke-width="${1.2 * s}" stroke-linecap="round"/>`;
}

const PICTURES = [
  `<path d="M10 14h22v14c0 6-5 10-11 10s-11-4-11-10z" fill="#ffd8c2" ${OUTLINE}/><path d="M32 18c6 0 6 9 0 9" fill="none" ${OUTLINE}/><ellipse cx="21" cy="14" rx="11" ry="3" fill="#a9785f" ${OUTLINE}/><circle cx="16" cy="11" r="3.4" fill="#fff" ${OUTLINE}/><circle cx="23" cy="10" r="3" fill="#fff" ${OUTLINE}/><path d="M17 5q2-3 0-5M24 5q2-3 0-5" fill="none" stroke="#c7b3d6" stroke-width="1.6" stroke-linecap="round"/>${face(21, 26, .8)}`,
  `<path d="M11 20c0-9 4-14 10-14s10 5 10 13v9H11z" fill="#ff9cc2" ${OUTLINE}/><path d="M29 16c4-2 7 1 6 5-1 3-4 3-6 2" fill="#ff9cc2" ${OUTLINE}/><rect x="9" y="28" width="24" height="8" rx="4" fill="#fff" ${OUTLINE}/>${face(20, 20, .75)}`,
  `<circle cx="20" cy="27" r="11" fill="#fff" ${OUTLINE}/><circle cx="20" cy="12" r="8" fill="#fff" ${OUTLINE}/><path d="M12 7h16M15 7l1-6h8l1 6" fill="${INK}" ${OUTLINE}/><path d="M13 17q7 4 14 0l1 3q-8 4-16 0z" fill="#6fd0ad" ${OUTLINE}/>${face(20, 13, .72)}`,
  `<path d="M20 3l4.6 10 10.8 1.2-8 7.4 2.3 10.7L20 27 10.3 32.3l2.3-10.7-8-7.4L15.4 13z" fill="#ffe9a8" ${OUTLINE}/>${face(20, 18, .7)}`,
  `<circle cx="20" cy="21" r="14" fill="#e0b07a" ${OUTLINE}/><g fill="#8a5a3c"><circle cx="13" cy="15" r="1.6"/><circle cx="28" cy="17" r="1.6"/><circle cx="24" cy="30" r="1.6"/><circle cx="13" cy="28" r="1.4"/></g>${face(20, 20, .75)}`,
  `<path d="M20 5c-7 0-10 6-10 13v7l-3 5h26l-3-5v-7c0-7-3-13-10-13z" fill="#ffe9a8" ${OUTLINE}/><circle cx="20" cy="33" r="3" fill="#f5ac6a" ${OUTLINE}/><path d="M17 3h6" ${OUTLINE}/>${face(20, 19, .7)}`,
  `<rect x="7" y="15" width="26" height="20" rx="4" fill="#d8ccff" ${OUTLINE}/><rect x="5" y="11" width="30" height="7" rx="3" fill="#c3b3fb" ${OUTLINE}/><path d="M20 11v24" stroke="#ff9cc2" stroke-width="4"/><path d="M20 11c-5-8-11-4-7 0zM20 11c5-8 11-4 7 0z" fill="#ff9cc2" ${OUTLINE}/>${face(20, 25, .7)}`,
  `<path d="M8 32c0-6 4-8 9-8h3V6h10v20c0 6-4 10-10 10h-6c-4 0-6-2-6-4z" fill="#bff0df" ${OUTLINE}/><path d="M20 10h10M20 15h10" stroke="#fff" stroke-width="3"/>${face(19, 30, .55)}`,
].map((inner) => svg('0 0 40 40', inner));

const picture = (index) => PICTURES[index % PICTURES.length];

const LIGHTS = ['#ff9cc2', '#ffe9a8', '#bff0df', '#d8ccff'];

function bulb(i) {
  const x = 6 + i * 29;
  const y = 24 + 10 * Math.abs(Math.sin((i + .5) * .9));
  const color = LIGHTS[i % LIGHTS.length];
  return `<g class="bulb"><circle cx="${x}" cy="${y + 7}" r="9" fill="${color}" opacity=".45"/>`
    + `<rect x="${x - 2}" y="${y - 1}" width="4" height="4" rx="1" fill="#a684a0"/>`
    + `<ellipse cx="${x}" cy="${y + 7}" rx="4" ry="5.5" fill="${color}" stroke="#fff" stroke-width="1"/></g>`;
}

const GARLAND = '<path d="M-10 18Q50 52 110 26T230 28T350 26T410 18" fill="none" stroke="#a684a0" stroke-width="1.6"/>'
  + Array.from({ length: 14 }, (_, i) => bulb(i)).join('');

const sparkle = ([x, y, r, color]) => `<path class="tw" d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}`
  + `Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}z" fill="${color}"/>`;
const SPARKLES = [[60, 70, 6, '#fff'], [110, 104, 4, '#fff7c9'], [280, 110, 5, '#fff'], [360, 130, 4, '#fff7c9'], [150, 60, 3.5, '#fff']];

const tree = ([x, y, s, color]) => `<g transform="translate(${x} ${y}) scale(${s})">`
  + `<path d="M0-40C8-30 14-24 10-22C18-14 22-8 16-6C24 2 22 8 0 8S-24 2-16-6C-22-8-18-14-10-22C-14-24-8-30 0-40Z" fill="${color}"/>`
  + '<path d="M-10-22C-4-19 4-19 10-22M-16-6C-6-2 6-2 16-6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
  + '<circle cy="-42" r="3.5" fill="#ffe9a8"/></g>';
const TREES = [[52, 206, 1.1, '#bff0df'], [92, 214, .8, '#d8ccff'], [342, 208, 1.15, '#ffd1e3'], [376, 216, .75, '#bff0df']];

const MOON = '<g transform="translate(330 70)"><circle r="30" fill="#fff7c9" opacity=".35"/>'
  + '<path d="M8-20A22 22 0 1 0 8 20A17 17 0 1 1 8-20Z" fill="#fff7c9"/><circle cx="-8" cy="2" r="1.6" fill="#6b4a63"/>'
  + '<path d="M-11 9q2 2 4 0" fill="none" stroke="#6b4a63" stroke-width="1.4" stroke-linecap="round"/><circle cx="-12" cy="6" r="2" fill="#ff9cc2" opacity=".6"/></g>';

const WISH_STAR = '<g class="star"><circle cx="262" cy="70" r="20" fill="url(#kawGlow)"/>'
  + '<path d="M262 58l3.5 7.6 8.3.9-6.2 5.7 1.8 8.2-7.4-4.2-7.4 4.2 1.8-8.2-6.2-5.7 8.3-.9z" fill="#ffe9a8" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></g>';

const horn = (side) => `<path d="M${-20 * side}-34C${-30 * side}-50 ${-28 * side}-66 ${-14 * side}-72C${-20 * side}-62 ${-18 * side}-52 ${-10 * side}-40Z" fill="#ffe9a8" stroke="#e7c27a" stroke-width="2"/>`
  + `<path d="M${-22 * side}-46l${6 * side}-2M${-24 * side}-54l${6 * side}-1M${-22 * side}-62l${5 * side} 0" stroke="#e7c27a" stroke-width="1.6" stroke-linecap="round"/>`;

const ear = (side, name) => `<path class="ear ${name}" d="M${-34 * side}-4C${-56 * side}-6 ${-64 * side} 6 ${-58 * side} 12C${-52 * side} 16 ${-40 * side} 10 ${-32 * side} 4Z" fill="#fff" ${SKIN}/>`
  + `<path class="ear ${name}" d="M${-38 * side} 0C${-50 * side} 0 ${-54 * side} 6 ${-52 * side} 9C${-48 * side} 11 ${-42 * side} 7 ${-38 * side} 3Z" fill="#ffd1e3"/>`;

const goatEye = (x) => `<g class="blink"><ellipse cx="${x}" cy="12" rx="5.6" ry="7.6" fill="${INK}"/>`
  + `<circle cx="${x - 2}" cy="9" r="2.4" fill="#fff"/><circle cx="${x + 2}" cy="15" r="1.1" fill="#fff"/></g>`;

const GOAT = '<path class="tail" d="M40 62c8-8 14-6 12 2s-8 6-12 4z" fill="#fff" stroke="#f0c9da" stroke-width="2"/>'
  + `<ellipse cx="0" cy="66" rx="46" ry="32" fill="#fff" ${SKIN}/>`
  + '<g fill="#fff" stroke="#f0c9da" stroke-width="2"><rect x="-24" y="80" width="14" height="22" rx="7"/><rect x="10" y="80" width="14" height="22" rx="7"/></g>'
  + '<path d="M-24 96h14v2a7 7 0 0 1-14 0zM10 96h14v2a7 7 0 0 1-14 0z" fill="#ffb3cd"/>'
  + ear(1, 'l') + ear(-1, 'r')
  + `<ellipse cx="0" cy="10" rx="40" ry="35" fill="#fff8f2" ${SKIN}/>`
  + horn(1) + horn(-1)
  + '<path d="M-38-6C-40-34-22-44 0-44S40-34 38-6Z" fill="#ff9cc2"/>'
  + '<path d="M-10-30v22M0-32v24M10-30v22M-22-26v18M22-26v18" stroke="#ff7fae" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>'
  + '<ellipse cx="-17" cy="-35" rx="6" ry="4" fill="#fff8f2"/><ellipse cx="17" cy="-35" rx="6" ry="4" fill="#fff8f2"/>'
  + '<rect x="-41" y="-12" width="82" height="13" rx="6.5" fill="#fff" stroke="#ffd1e3" stroke-width="2"/>'
  + '<path d="M-32-12v13M-22-12v13M-12-12v13M-2-12v13M8-12v13M18-12v13M28-12v13" stroke="#ffd1e3" stroke-width="2"/>'
  + '<g class="pom"><circle cx="0" cy="-49" r="10" fill="#fff" stroke="#ffd1e3" stroke-width="2"/><circle cx="-3" cy="-53" r="3.5" fill="#fff" opacity=".9"/></g>'
  + goatEye(-14) + goatEye(14)
  + '<g fill="#ff9cc2" opacity=".55"><circle cx="-26" cy="24" r="6.5"/><circle cx="26" cy="24" r="6.5"/></g>'
  + '<ellipse cx="0" cy="26" rx="10" ry="7" fill="#ffe7ee"/><ellipse cx="0" cy="23" rx="2.6" ry="1.8" fill="#ff9cc2"/>'
  + `<path d="M-4 28q2 3 4 0q2 3 4 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`
  + '<path d="M-5 33C-4 41 0 46 0 46S4 41 5 33Z" fill="#fff" stroke="#f0c9da" stroke-width="2"/>'
  + '<path d="M-36 40C-20 50 20 50 36 40L34 50C18 58-18 58-34 50Z" fill="#bff0df" stroke="#6fd0ad" stroke-width="2"/>'
  + '<path d="M-30 46l2 6M-20 49l1 6M-10 50v6M0 51v6M10 50v6M20 49l-1 6M30 46l-2 6" stroke="#fff" stroke-width="2" opacity=".8"/>'
  + '<g class="scarf-end"><path d="M18 52l4 30h12l-4-32z" fill="#bff0df" stroke="#6fd0ad" stroke-width="2"/>'
  + '<path d="M22 82v6M26 82v7M30 82v6M34 82v5" stroke="#6fd0ad" stroke-width="2" stroke-linecap="round"/></g>'
  + '<g class="bell"><path d="M-4 54h8M-6 66c0-8 2-12 6-12s6 4 6 12z" fill="#ffe9a8" stroke="#e7c27a" stroke-width="2"/>'
  + '<circle cx="0" cy="67" r="2" fill="#e7c27a"/><circle cx="-2" cy="58" r="1.4" fill="#fff"/></g>';

const DEFS = '<defs><linearGradient id="kawSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ccff"/>'
  + '<stop offset=".55" stop-color="#ffd6ea"/><stop offset="1" stop-color="#ffe9dc"/></linearGradient>'
  + '<radialGradient id="kawGlow"><stop offset="0" stop-color="#fff7c9"/><stop offset="1" stop-color="#fff7c9" stop-opacity="0"/></radialGradient></defs>';

function hero() {
  return svg('0 0 400 260', DEFS + '<rect width="400" height="260" fill="url(#kawSky)"/>'
    + MOON + SPARKLES.map(sparkle).join('') + WISH_STAR
    + '<path d="M0 200C60 176 120 186 170 198S300 178 400 196V260H0Z" fill="#fff" opacity=".85"/>'
    + TREES.map(tree).join('')
    + '<path d="M0 222C80 206 150 214 200 220S320 206 400 218V260H0Z" fill="#fff"/>'
    + '<g fill="#ffe3ef"><ellipse cx="120" cy="240" rx="40" ry="6"/><ellipse cx="300" cy="236" rx="34" ry="5"/></g>'
    + `<g transform="translate(200 132)">${GOAT}</g>` + GARLAND);
}

const SNOW_COLORS = ['rgba(255,156,194,.6)', 'rgba(216,204,255,.75)', 'rgba(191,240,223,.85)'];

function paintFlake(ctx, f) {
  const r = f.r * 1.3;
  ctx.fillStyle = ctx.shadowColor = SNOW_COLORS[f.kind];
  ctx.shadowBlur = 8;
  drawDot(ctx, f.x, f.y, r);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  drawDot(ctx, f.x - r * .3, f.y - r * .3, r * .3);
}

const HEART = svg('0 0 40 40', '<path d="M20 34C6 24 5 14 11 10c4-3 8-1 9 3 1-4 5-6 9-3 6 4 5 14-9 24z" fill="#ff9cc2"/>');
const sparkleBit = (color) => svg('-10 -10 20 20', `<path d="M0-9Q0 0 9 0Q0 0 0 9Q0 0-9 0Q0 0 0-9z" fill="${color}"/>`);
const PARTICLES = [HEART, sparkleBit('#ffe9a8'), sparkleBit('#d8ccff')];

export default {
  id: 'kawaii',
  fonts: ['Fredoka', 'Nunito'],
  color: '#fff3f8',
  icon: (day) => picture(day * 3),
  door: (day) => picture(day - 1),
  swatch: svg('-64 -78 128 128', GOAT),
  hero,
  snow: { count: 60, paint: paintFlake },
  particle: (k) => PARTICLES[k],
  burstDelay: 60,
  openDelay: 600,
};
