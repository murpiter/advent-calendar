export function drawStar(ctx, x, y, r, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let a = 0; a < 3; a++) {
    const angle = a * Math.PI / 3;
    ctx.moveTo(Math.cos(angle) * -r, Math.sin(angle) * -r);
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawDot(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
