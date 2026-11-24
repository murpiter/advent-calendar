import { drawStar } from './canvas.js';
import { flake, placeFlakes, svg } from './svg.js';

const ICONS = [
  svg('-20 -20 40 40', flake(6, 17, '#dcb85f', 2.2)),
  svg('-20 -20 40 40', flake(8, 17, '#dcb85f', 1.8)),
  svg('0 0 40 40', '<path d="M6 31l2-17 7 8 5-12 5 12 7-8 2 17z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><rect x="6" y="31" width="28" height="4" rx="1" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="8" cy="13" r="2" fill="#f2d98c"/><circle cx="20" cy="9" r="2" fill="#f2d98c"/><circle cx="32" cy="13" r="2" fill="#f2d98c"/>'),
  svg('0 0 40 40', '<path d="M20 3l3.4 11.6L35 20l-11.6 5.4L20 37l-3.4-11.6L5 20l11.6-5.4z" fill="url(#gold)" stroke="#7a5a16" stroke-width="1"/><circle cx="20" cy="20" r="3.4" fill="#0c1c45"/>'),
];

const STARS = [[50, 40], [350, 36], [90, 170], [320, 176], [30, 110], [372, 112]];

function hero() {
  return svg('0 0 400 240',
    '<circle cx="200" cy="118" r="84" fill="none" stroke="#dcb85f" stroke-width="2.5"/>'
    + '<circle cx="200" cy="118" r="76" fill="none" stroke="#dcb85f" stroke-width="1" stroke-dasharray="2 5"/>'
    + '<circle cx="200" cy="118" r="68" fill="#0c1c45" stroke="#dcb85f" stroke-width="1.5"/>'
    + `<g transform="translate(200 118)">${flake(8, 56, '#dcb85f', 2.4)}${flake(8, 26, '#dcb85f', 1.6)}<circle r="5" fill="url(#gold)"/></g>`
    + '<g fill="none" stroke="#dcb85f" stroke-width="2.4" stroke-linecap="round">'
    + '<path d="M112 118H60C36 118 28 96 44 88c14-7 26 8 14 16"/><path d="M288 118h52c24 0 32-22 16-30-14-7-26 8-14 16"/>'
    + '<path d="M122 100c-20-14-32-14-48-4M122 136c-20 14-32 14-48 4M278 100c20-14 32-14 48-4M278 136c20 14 32 14 48 4"/>'
    + '</g>'
    + '<g fill="url(#gold)"><path d="M200 24l6 8-6 8-6-8z"/><path d="M200 196l6 8-6 8-6-8z"/></g>'
    + placeFlakes(STARS, (i) => flake(i % 2 ? 6 : 8, 9, '#dcb85f', 1.4))
    + '<path d="M70 226H330" stroke="#dcb85f" stroke-width="1.5"/><path d="M200 220l8 6-8 6-8-6z" fill="url(#gold)"/>');
}

const CORNER = svg('0 0 56 56', '<g fill="none" stroke="#dcb85f" stroke-width="2.2" stroke-linecap="round"><path d="M4 52V16C4 8 10 4 18 4H52"/><path d="M12 52V22c0-6 4-10 10-10h30" opacity=".6"/><path d="M18 18c6-6 14-2 12 4-2 5-9 4-9-1"/></g><circle cx="8" cy="8" r="3" fill="url(#gold)"/>');

function paintFlake(ctx, f, t) {
  ctx.strokeStyle = `rgba(242,217,140,${.45 + f.kind * .15})`;
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  drawStar(ctx, f.x, f.y, f.r * 2.4, t / 4000 + f.phase);
}

export default {
  id: 'palace',
  icon: (day) => ICONS[day % ICONS.length],
  swatch: ICONS[0],
  hero,
  corner: CORNER,
  snow: { count: 38, paint: paintFlake },
  particle: (k) => svg('-20 -20 40 40', flake(k === 0 ? 6 : 8, 16, '#f2d98c', 2.4)),
  burstDelay: 650,
};
