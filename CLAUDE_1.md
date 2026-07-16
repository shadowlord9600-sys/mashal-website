# Mashal — Website Project Brief (CLAUDE.md)

This file is the source of truth for building the Mashal NGO website. Read this before writing any code.

---

## 1. Project Overview

**Organization:** Mashal (مشعل — Urdu/Persian for "torch" or "beacon," traditionally a symbol of guidance and enlightenment)

**Status:** Pre-launch. No workshops have run yet. One school head has received a one-pager pitch; no partner schools confirmed yet.

**Mission:** Give practical AI literacy to students in well-resourced private schools (e.g. Dar-e-Arqam, LGS, Learning Alliance/Punjab-tier schools) who have computer labs and access to devices, but whose curriculum only exposes them to AI as a chatbot. Mashal teaches them what AI can actually be used for — building websites, CRMs, automations, and leveraging it for career opportunities — i.e. real digital literacy, not just prompting a chatbox.

**Important framing note:** This is NOT a "underprivileged/poverty" narrative. The target schools are resource-rich. The gap Mashal addresses is a **training/curriculum gap**, not an access gap. All copy should reflect this — the schools have the labs, they just don't have anyone teaching real AI skills yet.

**Target audience for the website:**
- School heads / administrators (need to be convinced to give Mashal a session slot)
- Potential volunteers (tech/AI people, teachers, designers)
- Parents/students who may land on the site after a session or referral

---

## 2. Site Structure (2 pages only, for now)

Keep it lean. Do not add extra pages (Programs, Blog, Impact, Gallery) until Mashal has run real sessions and has content to fill them.

### Page 1: Home
Single-page scroll containing all pitch content, in this order:

1. **Hero**
   - Mission statement / headline
   - Core hook: "AI is more than a chatbox"
   - Two CTA buttons: "Bring Mashal to your school" and "Get involved"
   - Logo/ring signature animation lives here (see Section 4)

2. **Why Mashal**
   - The problem statement: schools have labs and devices, but AI is taught superficially (or not at all) beyond chatbot use
   - This section carries the emotional/logical case for why Mashal needs to exist

3. **What We Do**
   - Presented as short cards (title + 1-2 lines each), NOT full curriculum detail — these are planned programs, not past workshops:
     - **AI Beyond Chat** — intro session reframing what AI is capable of
     - **Build With AI** — hands-on: building simple websites, automations, mini-CRMs
     - **AI for Careers** — using AI for portfolios, resumes, exploring career paths
   - Keep copy honest about pre-launch status; do not imply sessions have already happened

4. **Get Involved**
   - Compact section (not a full page), three short blurbs:
     - **Schools** — how to invite Mashal in, what's required (lab slot, students, logistics)
     - **Volunteers** — what skills are needed (AI/tech, teaching, design, social media)
     - **Contact CTA**

5. **Contact**
   - Can live as the final section or in the footer
   - Email, social links, simple contact form (no backend needed yet — can be a mailto or placeholder form)

### Page 2: About
- Origin story — why Mashal was started, what problem was noticed
- Mission & vision statements
- Founder/team bios with photos (placeholder if photos not yet available)
- Values section

---

## 3. Copy Guidelines

- Do not fabricate stats, past workshop numbers, or testimonials. Mashal is pre-launch — copy should read as confident and credible about the *plan*, not dishonest about *results*.
- Avoid "underprivileged"/poverty framing. Use language like "under-taught," "untapped," "overlooked gap," "labs sitting underused."
- Write from the reader's side: a school head wants to know what's required of them and what students gain — not internal org details.
- Active voice, plain verbs, no filler. Buttons say exactly what happens ("Bring Mashal to your school," not "Learn more").
- Tone: confident, modern, youth-relevant but credible to school administrators — not overly casual, not corporate-stiff.

---

## 4. Design System

### Logo
- Existing logo: circular emblem, conic gradient ring (violet → blue), Urdu calligraphy "مشعل" (Mashal) with an abstract figure/growth motif inside the wordmark.
- Only a white-background PNG is currently available (`Gemini_Generated_Image_.png`, uploaded). No transparent version yet.
  - **Action needed during build:** produce a cleaned/transparent cutout of the logo for use on dark and light sections, OR keep the logo confined to a white/light card/circle background wherever it's placed so the white background isn't visible as a hard box.
- The gradient used in the site's accent colors and the signature animation should be sampled from this logo's ring, not an arbitrary purple/blue pairing.

### Color Palette
| Token | Hex | Use |
|---|---|---|
| Deep indigo-black | `#0D0B21` | Dark section backgrounds |
| Deep blue-purple | `#1A1650` | Primary dark / gradients |
| Electric violet | `#5B3FE0` | Primary accent |
| Clear blue | `#3B82F6` | Secondary accent |
| Violet-tinted white | `#F5F4FF` | Light section backgrounds |
| Pure white | `#FFFFFF` | Cards / contrast surfaces |

Note: sample actual hex values from the uploaded logo file during implementation and adjust the above if the logo's true gradient differs.

### Typography
- **Display face:** geometric, confident sans for headlines (e.g. Space Grotesk or Clash Display) — modern and tech-literate without feeling cold
- **Body face:** highly readable sans for body copy (e.g. Inter) — must read comfortably to non-technical parents/administrators, not just students
- **Utility/label face (optional):** monospace for small eyebrows/labels, used sparingly as a nod to "code/tech" — do not overuse

### Layout
- Minimal single-column flow on Home, generous whitespace
- Sections separated by subtle gradient dividers (blue → violet), not hard rules
- Sticky top nav: logo mark (left), 2 links — Home / About — plus a contact/CTA button (right); collapses to hamburger on mobile
- Fully responsive down to mobile

### Signature Element
- The logo's own ring is the site's signature motif — NOT a separate icon (previously considered torch/orb ideas are superseded by this).
- On hero load: the ring draws itself in as an animated stroke around the wordmark/logo mark, evoking "illumination" / "completion" — reinforcing the brand without introducing a second unrelated visual concept.
- The abstract figure/growth motif inside the logo can be echoed subtly elsewhere (e.g. icon style in the "Get Involved" section) — do not copy the logo itself, just take stylistic cues (line quality, gesture).

### Motion / Animation
- Keep restrained — one orchestrated hero load-in sequence (ring draws in → headline → CTA), not scattered effects throughout
- Scroll-triggered fade/slide-ins per section, subtle, no bounce/elastic easing
- Hover states: gentle scale/glow on buttons and cards only
- Respect `prefers-reduced-motion`

### Quality Bar
- Responsive down to mobile
- Visible keyboard focus states
- Accessible contrast ratios, especially violet/blue accents on dark backgrounds
- No numbered markers (01/02/03) unless content is genuinely sequential — the three program cards are NOT a sequence, so avoid numbering them

---

## 5. Explicit Non-Goals (for now)

- No Programs/Impact/Gallery/Blog pages yet — only Home + About
- No real stats, testimonials, or partner school logos — none exist yet
- No backend/CMS — static site is sufficient at this stage
- No donation/payment flow yet

---

## 6. Open Items to Revisit Later

- Transparent-background version of the logo
- Real team/founder photos
- Confirmed partner schools (once secured, "Get Involved → Schools" copy can be upgraded with actual names/logos)
- Expand "What We Do" into its own detailed page once real workshops have run
