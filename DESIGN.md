# Mashal — Design System

## Technical Architecture

- **Type:** Static site. No backend, no CMS, no database — nothing in CONTEXT.md requires dynamic data yet.
- **Stack:** Plain HTML/CSS/JS (or a lightweight static framework if preferred later, e.g. Astro) — no need for a full app framework like React/Next for a 2-page static brochure site.
- **Contact form:** Since there's no backend, use a static-form service (e.g. Formspree, or a `mailto:` link) rather than building custom form handling.
- **Fonts:** Self-hosted or loaded via Google Fonts / a font CDN — display face, body face, optional mono face (see Typography).
- **Animation libraries:** Keep dependencies minimal. CSS transitions/keyframes and the Intersection Observer API can cover scroll-reveals and hover states without a library. The ring stroke-draw animation can be done with SVG `stroke-dasharray`/`stroke-dashoffset`, no library needed.
- **Assets:** Logo PNG stored in an `/assets` (or `/images`) folder; a cleaned/transparent version should be produced during build (see Logo section below).

### File / Folder Structure

```
mashal-website/
├── index.html          # Home page
├── about.html          # About page
├── /assets
│   ├── /images
│   │   ├── logo.png            # original white-bg logo
│   │   └── logo-transparent.png # cleaned cutout (to produce)
│   └── /icons                  # any small icons used in Get Involved section
├── /css
│   ├── tokens.css       # color/type variables (design tokens from this file)
│   ├── main.css         # shared layout, nav, footer
│   ├── home.css
│   └── about.css
├── /js
│   ├── nav.js            # mobile nav toggle
│   ├── scroll-reveal.js  # Intersection Observer section reveals
│   └── ring-animation.js # hero ring stroke-draw sequence
└── CLAUDE.md / CONTEXT.md / DESIGN.md   # project reference docs (not shipped)
```

- Keep CSS variables (colors, type scale, spacing) centralized in `tokens.css` so both pages stay visually consistent and the palette can be adjusted in one place once real logo hex values are confirmed.

## Page / Layout Architecture

Wireframe-level structure for each page, matching the content order defined in CONTEXT.md / the original page plan.

### Home (`index.html`)

```
┌─────────────────────────────────────────┐
│ NAV: [Logo]         Home  About  [Contact CTA] │  ← sticky
├─────────────────────────────────────────┤
│               HERO                       │
│   [ring stroke-draw anim] → [headline]   │
│   "AI is more than a chatbox"            │
│   [Bring Mashal to your school] [Get involved] │
├─────────────────────────────────────────┤
│            WHY MASHAL                    │
│   Problem statement, 1 column, generous  │
│   whitespace, no imagery required        │
├─────────────────────────────────────────┤
│            WHAT WE DO                    │
│   [Card: AI Beyond Chat]                 │
│   [Card: Build With AI]                  │
│   [Card: AI for Careers]                 │
│   (3-across on desktop, stacked mobile — │
│   no numbering, these are parallel)      │
├─────────────────────────────────────────┤
│           GET INVOLVED                   │
│   [Schools blurb] [Volunteers blurb]     │
│   [Contact CTA]                          │
├─────────────────────────────────────────┤
│             CONTACT                      │
│   Email / socials / simple form          │
├─────────────────────────────────────────┤
│ FOOTER: logo mark, nav links, socials    │
└─────────────────────────────────────────┘
```

### About (`about.html`)

```
┌─────────────────────────────────────────┐
│ NAV (same as Home)                       │
├─────────────────────────────────────────┤
│            OUR STORY                     │
│   Why Mashal was started, the problem    │
│   that was noticed                       │
├─────────────────────────────────────────┤
│         MISSION & VISION                 │
│   Two short statements, side by side on  │
│   desktop, stacked on mobile             │
├─────────────────────────────────────────┤
│              TEAM                        │
│   [Founder photo/placeholder + bio]      │
│   [Additional team cards as needed]      │
├─────────────────────────────────────────┤
│             VALUES                       │
│   Short list/grid of values              │
├─────────────────────────────────────────┤
│ FOOTER (same as Home)                    │
└─────────────────────────────────────────┘
```

- Both pages share nav + footer markup/styles (`main.css`) so updates only need to happen once.
- Section order on each page should not be rearranged without updating this file — CONTEXT.md defines *why* each section exists in this order (problem → solution → how to engage → contact).

## Logo

- Existing logo: circular emblem with a conic gradient ring (violet → blue), Urdu calligraphy "مشعل" (Mashal) at center, with an abstract figure/growth motif worked into the wordmark.
- Only a white-background PNG currently exists (`Gemini_Generated_Image_.png`). No transparent version yet.
  - **Action needed during build:** produce a cleaned/transparent cutout for use on dark sections, OR consistently place the logo inside a light card/circle so the white background never appears as a hard box against darker sections.
- All accent gradients used across the site should be sampled from this logo's ring, not an arbitrary purple/blue pairing — check actual hex values against the file during implementation and adjust the palette below if they differ.

## Color Palette

| Token | Hex | Use |
|---|---|---|
| Deep indigo-black | `#0D0B21` | Dark section backgrounds |
| Deep blue-purple | `#1A1650` | Primary dark / gradient base |
| Electric violet | `#5B3FE0` | Primary accent |
| Clear blue | `#3B82F6` | Secondary accent |
| Violet-tinted white | `#F5F4FF` | Light section backgrounds |
| Pure white | `#FFFFFF` | Cards / contrast surfaces |

## Typography

- **Display face:** geometric, confident sans for headlines (e.g. Space Grotesk or Clash Display) — modern and tech-literate without feeling cold.
- **Body face:** highly readable sans for body copy (e.g. Inter) — must be comfortable for non-technical parents/administrators to read, not just students.
- **Utility/label face (optional):** monospace for small eyebrows/labels, used sparingly as a nod to "code/tech." Do not overuse — this is a garnish, not a workhorse font.

## Layout

- Minimal single-column scroll on Home, generous whitespace between sections.
- Section dividers should be soft gradient transitions (blue → violet), never hard rules.
- **Nav:** sticky top bar. Logo mark left; Home / About links plus a contact/CTA button right. Collapses to a hamburger menu on mobile.
- Fully responsive down to mobile widths.

## Signature Element

- The logo's own ring is the site's signature motif — do not introduce a separate icon system (e.g. a torch or orb) alongside it; that would compete with the real logo.
- **Hero load sequence:** the ring draws itself in as an animated stroke around the wordmark/logo mark first, then the headline appears, then the CTA buttons. One orchestrated moment, not simultaneous.
- The abstract figure/growth motif inside the logo can be echoed subtly elsewhere (e.g. icon style in the "Get Involved" section) through line quality and gesture — never by duplicating the logo itself.

## Motion / Animation

- Restraint is the rule: one orchestrated hero load-in, not effects scattered through every section.
- Scroll-triggered reveals: subtle fade/slide-in per section, no bounce or elastic easing.
- Hover states: gentle scale/glow on buttons and cards only.
- Respect `prefers-reduced-motion` — disable non-essential motion for users who request it.

## Structural Rules

- No numbered markers (01 / 02 / 03) unless content is a genuine sequence. The three "What We Do" program cards are parallel options, not a sequence — do not number them.
- Every structural device (dividers, labels, eyebrows) should encode something true about the content, not just decorate the page.

## Quality Bar

- Responsive down to mobile.
- Visible keyboard focus states on all interactive elements.
- Accessible contrast ratios, particularly for violet/blue accents placed on dark backgrounds — verify against WCAG AA before finalizing.
- Copy and design should never imply results, testimonials, or scale that don't exist yet (see CONTEXT.md).
