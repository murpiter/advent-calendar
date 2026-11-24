import { drawDot, drawStar } from './canvas.js';
import { flake, svg } from './svg.js';

const ICONS = [
  svg('-20 -20 40 40', flake(6, 17, '#dcb85f', 2.2)),
  svg('-20 -20 40 40', flake(8, 17, '#dcb85f', 1.8)),
  svg('0 0 40 40', '<path d="M6 31l2-17 7 8 5-12 5 12 7-8 2 17z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><rect x="6" y="31" width="28" height="4" rx="1" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="8" cy="13" r="2" fill="#f2d98c"/><circle cx="20" cy="9" r="2" fill="#f2d98c"/><circle cx="32" cy="13" r="2" fill="#f2d98c"/>'),
  svg('0 0 40 40', '<path d="M20 3l3.4 11.6L35 20l-11.6 5.4L20 37l-3.4-11.6L5 20l11.6-5.4z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="20" cy="20" r="3.4" fill="#0c1c45"/>'),
];

const OUTLINE = 'stroke="#6b4c10" stroke-width=".7"';

function starPath(cx, cy, outer, inner, points, rotation = 0) {
  const corners = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = rotation + i * Math.PI / points;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${corners.join('L')}Z`;
}

const strokes = (limbs, color, extra) => limbs.map(([d, width]) => `<path d="${d}" fill="none" stroke="${color}" `
  + `stroke-width="${width + extra}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
const engraved = (limbs) => strokes(limbs, '#6b4c10', 1.8) + strokes(limbs, 'url(#palGold)', 0);

const HIND = [['M36 74C20 72 10 58 16 46C20 38 14 30 8 34', 4], ['M40 72L34 90L31 104', 9], ['M25 106H39', 5], ['M48 74L60 86L70 84', 8]];
const FORE = [['M60 42L74 32L83 23', 7], ['M58 52L72 54L83 50', 7]];
const CLAWS = '<path d="M83 23l5-4M83 23l6 0M83 23l4 4M83 50l5-4M83 50l6 0M83 50l4 4M70 84l5-3M70 84l6 1M70 84l4 4" stroke="url(#palGold)" stroke-width="1.6" stroke-linecap="round"/>';

const LION = '<symbol id="palLion" viewBox="0 -8 92 118">'
  + engraved(HIND)
  + `<path d="${starPath(8, 33, 7, 2.6, 5, -.3)}" fill="url(#palGold)" ${OUTLINE}/>`
  + `<path d="M36 78C30 62 38 46 52 38L68 44C64 58 58 70 52 80Z" fill="url(#palGold)" ${OUTLINE}/>`
  + '<path d="M44 52C48 56 48 64 44 68M40 56C42 60 42 66 40 70" fill="none" stroke="#6b4c10" stroke-width=".7" opacity=".7"/>'
  + `<path d="${starPath(60, 25, 21, 14, 14, .15)}" fill="url(#palGold)" ${OUTLINE}/>`
  + engraved(FORE) + CLAWS
  + `<circle cx="67" cy="24" r="9.5" fill="#f2d98c" ${OUTLINE}/>`
  + `<path d="M71 18L86 21L81 25L86 29L72 32Z" fill="#fbeaa8" ${OUTLINE}/>`
  + '<path d="M80 25L87 26L81 27Z" fill="#c0392b"/>'
  + '<circle cx="69" cy="21" r="1.5" fill="#0a1836"/><path d="M65 18.5l5-1.5" stroke="#6b4c10" stroke-width="1"/>'
  + `<path d="M56 6l2-9 3.5 5.5 3.5-7 3.5 7 3.5-5.5 2 9z" fill="url(#palGold)" ${OUTLINE}/><circle cx="64.5" cy="-3" r="1.4" fill="#fff8dc"/>`
  + '</symbol>';

const ACANTHUS = '<symbol id="palAcanthus" viewBox="0 0 80 30">'
  + '<path d="M0 20C12 20 18 8 30 8C40 8 42 18 34 20C28 22 26 15 31 14M34 20C48 25 62 26 80 20" fill="none" stroke="url(#palGoldV)" stroke-width="3" stroke-linecap="round"/>'
  + `<path d="M19 12C22 4 32-1 41 1C36 3 39 7 34 8C39 9 37 13 32 12C35 15 31 17 28 15C27 18 22 17 22 14Z" fill="url(#palGoldV)" ${OUTLINE}/>`
  + `<path d="M46 23C51 15 60 14 65 18C60 18 61 21 56 22C60 24 56 27 51 25C51 28 46 27 46 23Z" fill="url(#palGoldV)" ${OUTLINE}/>`
  + '</symbol>';

const GLINT = (x, y, r) => `<path class="glint" d="M${x} ${y - r}l${r * .2} ${r * .8}L${x + r} ${y}l${-r * .8} ${r * .2}L${x} ${y + r}l${-r * .2} ${-r * .8}L${x - r} ${y}l${r * .8} ${-r * .2}z"/>`;

const CORNER_ART = '<symbol id="palCorner" viewBox="0 0 100 100">'
  + '<g fill="none" stroke="url(#palGold)" stroke-width="2.2" stroke-linecap="round">'
  + '<path d="M6 6H66C78 6 82 15 76 19C72 21 68 17 71 14M6 6V66C6 78 15 82 19 76C21 72 17 68 14 71"/>'
  + '<path d="M12 12C34 16 46 32 42 48C39 57 29 55 31 47C33 41 38 43 37 46M12 12C16 34 32 46 48 42C57 39 55 29 47 31C41 33 43 38 46 37"/>'
  + '<path d="M30 6C34 14 44 16 50 12M6 30C14 34 16 44 12 50" stroke-width="1.6"/></g>'
  + `<g fill="url(#palGold)" ${OUTLINE}>`
  + '<path d="M18 18C22 10 32 8 38 12C33 13 34 17 29 17C33 19 30 23 26 21C26 25 21 25 18 18Z"/>'
  + '<path d="M18 18C10 22 8 32 12 38C13 33 17 34 17 29C19 33 23 30 21 26C25 26 25 21 18 18Z"/>'
  + '<circle cx="20" cy="20" r="3.4"/><circle cx="71" cy="14" r="2"/><circle cx="14" cy="71" r="2"/></g>'
  + `<g fill="#fff8dc">${GLINT(20, 20, 7)}${GLINT(44, 45, 5)}${GLINT(70, 7, 4)}</g>`
  + '</symbol>';

const DEFS = '<defs>'
  + '<linearGradient id="palGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#f2d98c"/><stop offset=".65" stop-color="#d9b45b"/><stop offset="1" stop-color="#9b7421"/></linearGradient>'
  + '<linearGradient id="palGoldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#d9b45b"/><stop offset="1" stop-color="#8a6518"/></linearGradient>'
  + '<linearGradient id="palWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14306e"/><stop offset="1" stop-color="#081538"/></linearGradient>'
  + '<linearGradient id="palDrape" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a1c4a"/><stop offset=".5" stop-color="#1d3f8f"/><stop offset="1" stop-color="#0a1c4a"/></linearGradient>'
  + '<radialGradient id="palCandle"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>'
  + '<linearGradient id="palRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".35"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></linearGradient>'
  + '<linearGradient id="palGleam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff8dc" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
  + '<pattern id="palFrieze" width="80" height="30" patternUnits="userSpaceOnUse"><use href="#palAcanthus" width="80" height="30"/></pattern>'
  + '<pattern id="palFriezeS" width="80" height="30" patternUnits="userSpaceOnUse" patternTransform="scale(.47)"><use href="#palAcanthus" width="80" height="30"/></pattern>'
  + '<clipPath id="palClip"><rect width="400" height="220" rx="10"/></clipPath>'
  + LION + ACANTHUS + CORNER_ART + '</defs>';

const CANDLES = [[-46, 30], [-28, 26], [28, 26], [46, 30]];
const CRYSTALS = [[-40, 58], [-26, 60], [-12, 62], [0, 64], [12, 62], [26, 60], [40, 58]];

const CHANDELIER = '<g transform="translate(200 0)">'
  + '<path d="M0 0V22" stroke="url(#palGold)" stroke-width="2"/>'
  + '<path d="M-46 40Q-46 56 0 56Q46 56 46 40M-28 36Q-28 48 0 48Q28 48 28 36" fill="none" stroke="url(#palGold)" stroke-width="2.4"/>'
  + '<ellipse cx="0" cy="30" rx="10" ry="9" fill="url(#palGold)"/>'
  + `<g fill="#cfe6ff" opacity=".7">${CRYSTALS.map(([x, y]) => `<circle class="crystal" cx="${x}" cy="${y}" r="2.3"/>`).join('')}</g>`
  + CANDLES.map(([x, y]) => `<circle class="halo" cx="${x}" cy="${y}" r="14" fill="url(#palCandle)"/>`
    + `<rect x="${x - 2}" y="${y + 2}" width="4" height="8" fill="#f3e7c6"/>`
    + `<ellipse class="flame" cx="${x}" cy="${y - 2}" rx="2.2" ry="4" fill="#ffcf7a"/>`).join('')
  + '</g>';

const RAYS = '<g fill="url(#palRay)"><path class="ray" d="M154 38L110 190H170Z"/><path class="ray" d="M172 34L150 190H200Z"/>'
  + '<path class="ray" d="M228 34L250 190H200Z"/><path class="ray" d="M246 38L290 190H230Z"/></g>';

const CURTAINS = '<path class="curtain l" d="M0 0H70Q60 60 74 120Q40 110 30 160Q14 100 0 110Z" fill="url(#palDrape)"/>'
  + '<path class="curtain r" d="M400 0H330Q340 60 326 120Q360 110 370 160Q386 100 400 110Z" fill="url(#palDrape)"/>'
  + '<g fill="url(#palGold)"><circle cx="74" cy="122" r="3.5"/><path d="M72 124h4l2 12h-8z"/><circle cx="326" cy="122" r="3.5"/><path d="M324 124h4l2 12h-8z"/></g>';

const LETTER = /\p{L}/u;
const monogram = (title) => ([...title].find((char) => LETTER.test(char)) ?? '✦').toUpperCase();

const crest = (title) => '<g transform="translate(200 128)" class="gilt">'
  + '<path d="M-30-36H30V0C30 24 0 38 0 38C0 38-30 24-30 0Z" fill="#0d2156" stroke="url(#palGold)" stroke-width="3"/>'
  + '<path d="M-24-30H24V0C24 19 0 31 0 31C0 31-24 19-24 0Z" fill="none" stroke="url(#palGold)" stroke-width=".8"/>'
  + `<text y="12" text-anchor="middle" font-family="Playfair Display, serif" font-style="italic" font-size="38" fill="url(#palGold)">${monogram(title)}</text>`
  + '<path d="M-18-46l4-12 7 8 7-12 7 12 7-8 4 12z" fill="url(#palGold)"/><circle cy="-60" r="2.4" fill="#fff8dc"/></g>';

function hero(title) {
  return svg('0 0 400 220', DEFS + '<g clip-path="url(#palClip)">'
    + '<rect width="400" height="220" fill="url(#palWall)"/>'
    + '<g fill="none" stroke="#d9b45b" stroke-opacity=".22"><path d="M60 190V90a140 140 0 0 1 280 0v100"/><path d="M80 190V96a120 120 0 0 1 240 0v94"/></g>'
    + RAYS
    + '<g fill="url(#palGoldV)" class="gilt"><rect x="44" y="70" width="10" height="120"/><rect x="346" y="70" width="10" height="120"/><rect x="40" y="64" width="18" height="8"/><rect x="342" y="64" width="18" height="8"/></g>'
    + '<path d="M0 190H400V220H0Z" fill="#081538"/>'
    + '<svg y="191" width="400" height="30" class="gilt"><rect width="400" height="30" fill="url(#palFrieze)"/></svg>'
    + '<path d="M0 191H400M0 219H400" stroke="url(#palGold)" stroke-width="1.5"/>'
    + CHANDELIER
    + '<use href="#palLion" x="80" y="82" width="86" height="105" class="gilt"/>'
    + '<use href="#palLion" x="-320" y="82" width="86" height="105" transform="scale(-1 1)" class="gilt"/>'
    + crest(title)
    + CURTAINS
    + '<rect width="400" height="14" fill="#0a1c4a"/><svg width="400" height="14"><rect width="400" height="14" fill="url(#palFriezeS)"/></svg>'
    + '<path d="M0 14H400" stroke="url(#palGold)" stroke-width="2"/>'
    + '<rect class="shine" width="90" height="220" fill="url(#palGleam)"/>'
    + '<use href="#palCorner" width="60" height="60"/><use href="#palCorner" x="-400" width="60" height="60" transform="scale(-1 1)"/>'
    + '</g><rect width="400" height="220" rx="10" fill="none" stroke="url(#palGold)" stroke-width="2"/>');
}

const CORNER = svg('0 0 100 100', '<use href="#palCorner"/>');

function paintMote(ctx, f, t) {
  const twinkle = (Math.sin(t / 400 + f.phase * 5) + 1) / 2;
  ctx.fillStyle = `rgba(242,217,140,${.3 + twinkle * .6})`;
  drawDot(ctx, f.x, f.y, f.r * .45 * (1 + twinkle * .5));
  if (twinkle < .95 || f.r < 3) return;
  ctx.strokeStyle = 'rgba(255,248,220,.9)';
  ctx.lineWidth = 1;
  drawStar(ctx, f.x, f.y, 6, 0);
}

const SPARKLE = svg('-20 -20 40 40', '<path d="M0-18l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="#fff3c4"/>');
const FOIL = svg('0 0 40 40', '<rect x="14" y="6" width="12" height="28" rx="2" fill="url(#gold)"/>');

export default {
  id: 'palace',
  fonts: ['Cormorant Garamond', 'Playfair Display'],
  color: '#0a1836',
  icon: (day) => ICONS[day % ICONS.length],
  swatch: ICONS[0],
  hero,
  corner: CORNER,
  snow: { count: 110, paint: paintMote },
  particle: (k) => (k === 0 ? SPARKLE : FOIL),
  burstDelay: 80,
  openDelay: 750,
};
