import { drawDot, drawStar } from './canvas.js';
import { flake, svg } from './svg.js';

const ICONS = [
  svg('-20 -20 40 40', flake(6, 17, '#dcb85f', 2.2)),
  svg('-20 -20 40 40', flake(8, 17, '#dcb85f', 1.8)),
  svg('0 0 40 40', '<path d="M6 31l2-17 7 8 5-12 5 12 7-8 2 17z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><rect x="6" y="31" width="28" height="4" rx="1" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="8" cy="13" r="2" fill="#f2d98c"/><circle cx="20" cy="9" r="2" fill="#f2d98c"/><circle cx="32" cy="13" r="2" fill="#f2d98c"/>'),
  svg('0 0 40 40', '<path d="M20 3l3.4 11.6L35 20l-11.6 5.4L20 37l-3.4-11.6L5 20l11.6-5.4z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="20" cy="20" r="3.4" fill="#0c1c45"/>'),
];

const OUTLINE = 'stroke="#6b4c10" stroke-width=".7"';


const OUTLINE_LINE = 'fill="none" stroke="#6b4c10" stroke-width=".55" stroke-linecap="round"';
const horn = (d, width) => `<path d="${d}" fill="none" stroke="#6b4c10" stroke-width="${width + 1.2}" stroke-linecap="round"/>`
  + `<path d="${d}" fill="none" stroke="url(#palGold)" stroke-width="${width}" stroke-linecap="round"/>`;
const gilded = (paths) => paths.map((d) => `<path d="${d}" fill="url(#palGold)" ${OUTLINE}/>`).join('');

const GOAT_BODY = [
  'M40 88C35 75 41 61 53 52C57 49 61 48 65 50C64 59 60 67 56 75C52 83 51 90 51 96C46 97 42 95 40 88Z',
  'M57 53C57 44 59 37 63 31L71 37C68 42 67 47 66 51Z',
  'M41 86C40 98 38 106 35 113L33 119L38 119L38 114C43 106 47 98 50 91Z',
  'M50 88C56 90 61 93 64 98L67 104L70.5 103L68 96C65 90 60 86 54 83Z',
  'M60 51C66 49 72 46 77 42L82 37L84.5 39.5L80 44C74 50 68 54 63 56Z',
  'M59 60C64 61 69 62 72 66L74 72L77 71.5L76 65C73 59 67 56 60 55Z',
  'M41 84C37 80 34 75 36 69C38 73 41 77 44 80Z',
];
const GOAT_HEAD = [
  'M68 26C64 26 60.5 27.5 58.5 30C62 30.5 66 30 70 28.5Z',
  'M63 31C64 24 69 20 74 21C78 23 82 29 88 35C90 38 88 41 85 41C81 41 77 39 73 38C69 40 65 38 63 34Z',
  'M81 40.5C80 44 80.5 47 82.5 49.5C83.2 46.5 84.5 43.5 84.5 41Z',
];
const HOOVES = '<g fill="#3a2a08"><path d="M32.5 119h6l.5 2.5h-7z"/><path d="M66.6 104l4-1.2 1 2.6-4 1.2z"/>'
  + '<path d="M82 37l3.6-2.4 1.6 2.4-3.6 2.4z"/><path d="M73.6 72l3.6-.5.6 3.2-3.8.4z"/></g>';
const ENGRAVING = 'M60 52C58 56 59 60 62 62M45 72C47 66 51 61 56 57M43 80C46 75 49 71 53 68M42 97C42 103 40 108 38 112M78 29C81 32 84 35 86 37M72.5 26Q75 24.5 77.5 26';

const GOAT = '<symbol id="palGoat" viewBox="18 -6 76 130">'
  + horn('M67 23C60 12 50 8 42 12C35 16 36 26 43 27', 2.6)
  + gilded(GOAT_BODY) + HOOVES + gilded(GOAT_HEAD)
  + `<circle cx="75" cy="27.5" r="1.1" fill="#0a1836"/><path d="${ENGRAVING}" ${OUTLINE_LINE}/>`
  + horn('M71 22C66 8 52 0 40 4C28 8 24 22 32 30C38 36 48 32 46 24C45 19 39 19 38 23', 3.6)
  + '<path d="M62 10l3-3M57 6l2-3.5M51 3.5l1.2-3.6M45 3.5l0-3.6M39 5l-1.5-3.3" stroke="#6b4c10" stroke-width=".7" stroke-linecap="round"/>'
  + horn('M40 4C48-2 60 0 64 6M32 30C26 36 28 44 34 46C38 47 40 44 38 42', 1.2)
  + '<circle cx="38" cy="42" r="1.3" fill="#fff8dc"/><circle cx="64" cy="6" r="1.3" fill="#fff8dc"/>'
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
  + GOAT + ACANTHUS + CORNER_ART + '</defs>';

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
    + '<use href="#palGoat" x="84" y="58" width="78" height="134" class="gilt"/>'
    + '<use href="#palGoat" x="-316" y="58" width="78" height="134" transform="scale(-1 1)" class="gilt"/>'
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
