import { drawDot, drawStar } from './canvas.js';
import { flake, placeFlakes, svg } from './svg.js';

const ICONS = [
  svg('0 0 40 40', '<path d="M20 34C6 24 5 14 11 10c4-3 8-1 9 3 1-4 5-6 9-3 6 4 5 14-9 24z" fill="#ff8fb8" stroke="#ff6f9f" stroke-width="2" stroke-linejoin="round"/><circle cx="14" cy="15" r="2.4" fill="#fff" opacity=".7"/>'),
  svg('0 0 40 40', '<path d="M20 4l4.6 10 10.8 1.2-8 7.4 2.3 10.7L20 27.8 10.3 33.3l2.3-10.7-8-7.4L15.4 14z" fill="#ffd76a" stroke="#f5b93d" stroke-width="2" stroke-linejoin="round"/>'),
  svg('-20 -20 40 40', flake(6, 16, '#9a87f0', 2.4)),
  svg('0 0 40 40', '<g fill="#fff" stroke="#f3c6d8" stroke-width="2"><circle cx="9" cy="16" r="6"/><circle cx="31" cy="16" r="6"/><circle cx="14" cy="9" r="6"/><circle cx="26" cy="9" r="6"/></g><circle cx="9" cy="16" r="5" fill="#fff"/><circle cx="31" cy="16" r="5" fill="#fff"/><circle cx="14" cy="9" r="5" fill="#fff"/><circle cx="26" cy="9" r="5" fill="#fff"/><ellipse cx="20" cy="22" rx="11" ry="10" fill="#ffe9ef" stroke="#f3c6d8" stroke-width="2"/><ellipse cx="16" cy="22" rx="1.8" ry="2.4" fill="#4a3346"/><ellipse cx="24" cy="22" rx="1.8" ry="2.4" fill="#4a3346"/><circle cx="12.5" cy="26" r="2.4" fill="#ffb3cd" opacity=".8"/><circle cx="27.5" cy="26" r="2.4" fill="#ffb3cd" opacity=".8"/><path d="M18 27q2 2 4 0" fill="none" stroke="#4a3346" stroke-width="1.6" stroke-linecap="round"/>'),
  svg('0 0 40 40', '<g fill="#ffb3cd" stroke="#ff8fb8" stroke-width="1.5"><circle cx="20" cy="9" r="6.5"/><circle cx="31" cy="17" r="6.5"/><circle cx="27" cy="30" r="6.5"/><circle cx="13" cy="30" r="6.5"/><circle cx="9" cy="17" r="6.5"/></g><circle cx="20" cy="20" r="6" fill="#ffe27a" stroke="#f5b93d" stroke-width="1.5"/>'),
];

const SKY_FLAKES = [[40, 40, 12, '#ffb3cd'], [360, 50, 14, '#b9a7ff'], [70, 120, 9, '#9fe3cc'], [335, 125, 10, '#ffb3cd'], [110, 30, 8, '#b9a7ff'], [300, 28, 8, '#9fe3cc']];
const BODY = [[-46, 22, 26], [-28, 42, 24], [0, 48, 26], [28, 42, 24], [46, 22, 26], [-32, 0, 26], [32, 0, 26], [0, -6, 28]];

function fleece() {
  const ring = BODY.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="#f3c6d8"/>`).join('');
  const fill = BODY.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('');
  return ring + fill;
}

function hero() {
  return svg('0 0 400 240',
    '<ellipse cx="200" cy="236" rx="196" ry="38" fill="#fff"/><ellipse cx="200" cy="244" rx="150" ry="22" fill="#ffe3ef"/>'
    + '<g fill="#fff" opacity=".9"><ellipse cx="80" cy="80" rx="34" ry="12"/><ellipse cx="104" cy="72" rx="22" ry="12"/><ellipse cx="320" cy="90" rx="30" ry="10"/><ellipse cx="338" cy="82" rx="18" ry="10"/></g>'
    + placeFlakes(SKY_FLAKES, (_, r, color) => flake(6, r, color, 2))
    + '<g transform="translate(200 108)">'
    + '<rect x="-27" y="58" width="13" height="30" rx="6.5" fill="#8a6a86"/><rect x="14" y="58" width="13" height="30" rx="6.5" fill="#8a6a86"/>'
    + fleece()
    + '<path d="M-26 -8C-48 -22-54 2-38 2" fill="none" stroke="#b9a7ff" stroke-width="7" stroke-linecap="round"/><path d="M26 -8C48 -22 54 2 38 2" fill="none" stroke="#b9a7ff" stroke-width="7" stroke-linecap="round"/>'
    + '<ellipse cx="-38" cy="14" rx="15" ry="8" transform="rotate(-25 -38 14)" fill="#ffd1df"/><ellipse cx="38" cy="14" rx="15" ry="8" transform="rotate(25 38 14)" fill="#ffd1df"/>'
    + '<ellipse cx="0" cy="16" rx="34" ry="30" fill="#fff2e8" stroke="#f3c6d8" stroke-width="2.5"/>'
    + '<ellipse cx="-13" cy="18" rx="4.6" ry="6.4" fill="#4a3346"/><ellipse cx="13" cy="18" rx="4.6" ry="6.4" fill="#4a3346"/>'
    + '<circle cx="-14.6" cy="15.4" r="1.9" fill="#fff"/><circle cx="11.4" cy="15.4" r="1.9" fill="#fff"/>'
    + '<circle cx="-24" cy="29" r="6" fill="#ffb3cd" opacity=".75"/><circle cx="24" cy="29" r="6" fill="#ffb3cd" opacity=".75"/>'
    + '<path d="M-5 29Q-2.5 33 0 29Q2.5 33 5 29" fill="none" stroke="#4a3346" stroke-width="2" stroke-linecap="round"/>'
    + '<rect x="-31" y="46" width="62" height="13" rx="6.5" fill="#ff8fb8"/><path d="M-14 46v13M0 46v13M14 46v13" stroke="#fff" stroke-width="3" opacity=".7"/><rect x="14" y="54" width="13" height="26" rx="6.5" fill="#ff8fb8"/>'
    + '<path d="M-24 -12Q-14 -52 26 -46Q18 -30 24 -12Z" fill="#ff8fb8"/><ellipse cx="0" cy="-12" rx="27" ry="7" fill="#fff"/><circle cx="28" cy="-47" r="7" fill="#fff"/>'
    + '</g>');
}

const SNOW_COLORS = ['rgba(255,143,184,.75)', 'rgba(185,167,255,.75)', 'rgba(159,227,204,.85)'];

function paintFlake(ctx, f, t) {
  ctx.strokeStyle = ctx.fillStyle = SNOW_COLORS[f.kind];
  if (f.kind === 0) return drawDot(ctx, f.x, f.y, f.r * 1.1);
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  drawStar(ctx, f.x, f.y, f.r * 2.2, t / 3000 + f.phase);
}

export default {
  id: 'kawaii',
  fonts: ['Fredoka', 'Nunito'],
  icon: (day) => ICONS[day % ICONS.length],
  swatch: ICONS[3],
  hero,
  snow: { count: 46, paint: paintFlake },
  particle: (k) => ICONS[k],
  burstDelay: 80,
};
