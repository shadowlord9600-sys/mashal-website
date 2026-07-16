// Produce a clean transparent cutout of the Mashal logo.
//
// The source is a *render* of the logo on paper, not a flat white plate:
//   - the "white" is #f8f9fb..#ffffff (vignetted), not #ffffff
//   - there is a grey drop shadow under the ring
// So keying on white alone would leave a grey halo + a floating shadow.
//
// What separates ink from everything else is CHROMA: the ink is blue/purple
// (chroma 60-95), while both the paper and its shadow are neutral (chroma < 8).
// So: gate on chroma, take alpha from luminance, then un-multiply the paper out
// of the anti-aliased edge pixels so they don't carry a white fringe onto dark
// backgrounds.
const { decode, encode } = require('./png');
const fs = require('fs');

const PAPER = [250, 251, 253]; // representative paper colour (vignette 248..255)
const D_REF = 206;             // paper luminance - typical ink luminance (~249 - 43)
const CHROMA_GATE = 8;         // below this a pixel is paper or shadow, never ink
const PAD = 8;

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const chroma = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const img = decode(fs.readFileSync('assets/images/logo.png'));
const { width: W, height: H, data } = img;
const paperL = lum(...PAPER);

// --- pass 1: alpha + un-multiplied colour -----------------------------------
const out = Buffer.alloc(W * H * 4);
let kept = 0, gated = 0;

for (let i = 0; i < W * H; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  const c = chroma(r, g, b);

  if (c < CHROMA_GATE) {           // paper or drop shadow -> fully transparent
    out[i * 4 + 3] = 0;
    gated++;
    continue;
  }

  const a = clamp((paperL - lum(r, g, b)) / D_REF, 0, 1);
  if (a <= 0.004) { out[i * 4 + 3] = 0; continue; }

  // observed = a*ink + (1-a)*paper  ->  ink = (observed - (1-a)*paper) / a
  const un = (v, p) => clamp(Math.round((v - (1 - a) * p) / a), 0, 255);
  out[i * 4] = un(r, PAPER[0]);
  out[i * 4 + 1] = un(g, PAPER[1]);
  out[i * 4 + 2] = un(b, PAPER[2]);
  out[i * 4 + 3] = Math.round(a * 255);
  kept++;
}

// --- pass 2: crop to the visible ink, squared about its centre ---------------
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (out[(y * W + x) * 4 + 3] > 12) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}

const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
const half = Math.max(maxX - minX, maxY - minY) / 2 + PAD;
let sx = Math.round(cx - half), sy = Math.round(cy - half);
const size = Math.round(half * 2);

const cropped = Buffer.alloc(size * size * 4); // zero = transparent
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const srcX = sx + x, srcY = sy + y;
    if (srcX < 0 || srcY < 0 || srcX >= W || srcY >= H) continue;
    out.copy(cropped, (y * size + x) * 4, (srcY * W + srcX) * 4, (srcY * W + srcX) * 4 + 4);
  }
}

fs.writeFileSync('assets/images/logo-transparent.png', encode({ width: size, height: size, data: cropped }));

// --- report ------------------------------------------------------------------
const opaque = (() => { let n = 0; for (let i = 0; i < size * size; i++) if (cropped[i * 4 + 3] > 250) n++; return n; })();
const partial = (() => { let n = 0; for (let i = 0; i < size * size; i++) { const a = cropped[i * 4 + 3]; if (a > 12 && a <= 250) n++; } return n; })();

console.log(`source        : ${W} x ${H}`);
console.log(`ink bbox      : x ${minX}..${maxX}, y ${minY}..${maxY}`);
console.log(`crop          : ${size} x ${size} @ (${sx}, ${sy})  [squared about ink centre]`);
console.log(`gated neutral : ${gated} px (${((gated / (W * H)) * 100).toFixed(1)}%)  <- paper + drop shadow`);
console.log(`ink kept      : ${kept} px`);
console.log(`  fully opaque: ${opaque}`);
console.log(`  anti-aliased: ${partial}`);
console.log(`written       : assets/images/logo-transparent.png (${(fs.statSync('assets/images/logo-transparent.png').size / 1024).toFixed(1)} KB)`);

// Verify no white fringe survived: check the brightest colour among partly
// transparent pixels. A leftover fringe would show up as near-paper values.
let fringe = 0, worst = 0;
for (let i = 0; i < size * size; i++) {
  const a = cropped[i * 4 + 3];
  if (a > 12 && a < 200) {
    const L = lum(cropped[i * 4], cropped[i * 4 + 1], cropped[i * 4 + 2]);
    if (L > 200) fringe++;
    if (L > worst) worst = L;
  }
}
console.log(`fringe check  : ${fringe} light pixels among AA edges (brightest L=${worst.toFixed(0)}) ${fringe === 0 ? 'OK' : 'CHECK'}`);
