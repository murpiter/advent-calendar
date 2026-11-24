import qrcode from 'qrcode-generator';

const QUIET_ZONE = 2;

function modulesPath(qr) {
  const size = qr.getModuleCount();
  let path = '';
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (qr.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return path;
}

export function qrSvg(text) {
  const qr = qrcode(0, 'L');
  qr.addData(text, 'Byte');
  qr.make();
  const side = qr.getModuleCount() + QUIET_ZONE * 2;
  return `<svg viewBox="${-QUIET_ZONE} ${-QUIET_ZONE} ${side} ${side}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">`
    + `<rect x="${-QUIET_ZONE}" y="${-QUIET_ZONE}" width="${side}" height="${side}" fill="#fff"/><path d="${modulesPath(qr)}" fill="#000"/></svg>`;
}
