// Composite the cutout over the real site backgrounds to prove the alpha is clean.
const { decode, encode } = require('./png');
const fs = require('fs');

const logo = decode(fs.readFileSync('assets/images/logo-transparent.png'));
const S = 260;                       // display size per panel
const PADP = 24;
const panels = [
  ['dark indigo #0D0B21', [0x0d, 0x0b, 0x21]],
  ['deep blue-purple #1A1650', [0x1a, 0x16, 0x50]],
  ['violet-white #F5F4FF', [0xf5, 0xf4, 0xff]],
  ['checker', null],
];

const W = panels.length * (S + PADP) + PADP;
const H = S + PADP * 2;
const out = Buffer.alloc(W * H * 4);

// nearest-neighbour-ish sample with box averaging for a decent downscale
const sample = (sx, sy) => {
  const scale = logo.width / S;
  const x0 = Math.floor(sx * scale), y0 = Math.floor(sy * scale);
  const x1 = Math.min(logo.width, Math.floor((sx + 1) * scale));
  const y1 = Math.min(logo.height, Math.floor((sy + 1) * scale));
  let r = 0, g = 0, b = 0, a = 0, n = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * logo.width + x) * 4;
    const al = logo.data[i + 3] / 255;
    r += logo.data[i] * al; g += logo.data[i + 1] * al; b += logo.data[i + 2] * al;
    a += logo.data[i + 3]; n++;
  }
  if (!n) return [0, 0, 0, 0];
  const av = a / n / 255;
  return av === 0 ? [0, 0, 0, 0] : [r / n / av, g / n / av, b / n / av, a / n];
};

panels.forEach(([, bg], pi) => {
  const ox = PADP + pi * (S + PADP);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let back;
      if (bg) back = bg;
      else {
        const c = ((x >> 4) + (y >> 4)) % 2 === 0 ? 0xd8 : 0x99;
        back = [c, c, c];
      }
      const [r, g, b, a] = sample(x, y);
      const al = a / 255;
      const di = ((y + PADP) * W + (ox + x)) * 4;
      out[di] = Math.round(r * al + back[0] * (1 - al));
      out[di + 1] = Math.round(g * al + back[1] * (1 - al));
      out[di + 2] = Math.round(b * al + back[2] * (1 - al));
      out[di + 3] = 255;
    }
  }
});

fs.writeFileSync('tools/proof.png', encode({ width: W, height: H, data: out }));
console.log(`wrote tools/proof.png (${W}x${H}) — panels: ${panels.map(p => p[0]).join(' | ')}`);
