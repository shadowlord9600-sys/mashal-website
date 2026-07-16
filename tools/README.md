# tools/

Build-time asset scripts. Not shipped — nothing under `tools/` is referenced by
the site at runtime. Node only, no dependencies (`png.js` is a small PNG
codec built on Node's built-in `zlib`, since ImageMagick/Python aren't
available on this machine).

## Producing the transparent logo

DESIGN.md calls for a cleaned/transparent cutout of the logo to be produced
during build. `assets/images/logo.png` is the original: a *render* of the logo
on paper — the background is `#f8f9fb`–`#ffffff` (vignetted, not flat white)
and the ring casts a grey drop shadow. Keying out pure white would leave both
a grey halo and a floating shadow.

`cutout.js` instead separates ink from paper by **chroma**: the ink is
blue/purple (chroma 60–95) while the paper and its shadow are neutral
(chroma < 8). Alpha comes from luminance, and the paper colour is then
un-multiplied out of the anti-aliased edge pixels so they carry no white
fringe onto dark backgrounds.

```sh
node tools/cutout.js     # -> assets/images/logo-transparent.png
node tools/proof.js      # -> tools/proof.png, cutout composited over the
                         #    real site backgrounds + a checkerboard
```

Re-run both if `assets/images/logo.png` is ever replaced. `cutout.js` prints a
fringe check; it should report `0 light pixels among AA edges`.

## Note on the logo and dark backgrounds

The cutout is clean, but transparency alone does **not** make the logo usable
on dark sections — the artwork's own ink is deep navy/purple and measures only
~1.6–2.7:1 against `#0D0B21`. That is why every placement of the mark sits on
a light disc (`.logo-disc` in `css/main.css`), which is also what keeps the
original white background from ever reading as a hard box. Run `proof.js` to
see this directly.
