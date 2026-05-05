# customs-kokoraki.com

The website of **Εκτελωνιστικό Γραφείο Κοκοράκη / Kokoraki Customs** —
a family-run customs brokerage in Piraeus, Greece, operating since 1989.

> Run by Αλεξάνδρα Κοκοράκη and Γιώργος Κοκοράκης.

---

## Stack

Plain HTML, plain CSS, ~80 lines of vanilla JavaScript, and a 50-line
Python build script that handles shared partials. **No frameworks, no
package managers, no compilation step beyond running one Python file.**

This is intentional. The site is six pages, updated occasionally, and
will be hosted on cheap static hosting. A framework would have added
hundreds of dependencies and a build pipeline for zero benefit.

---

## Project structure

```
.
├── index.html              ← built output (committed)
├── services.html
├── about.html
├── contact.html
├── faq.html
├── useful_info.html
├── links.html
│
├── pages/                  ← page sources with {{partial:NAME}} markers
│   ├── index.html
│   └── ...
│
├── _partials/              ← reusable blocks (head, header, footer)
│   ├── head.html
│   ├── header.html
│   └── footer.html
│
├── assets/
│   ├── css/
│   │   ├── tokens.css      ← design tokens (single source of truth)
│   │   ├── base.css        ← reset, typography, a11y, print
│   │   └── components.css  ← all UI components
│   ├── js/
│   │   └── main.js         ← mobile nav, scroll reveals, lazy maps
│   ├── icons/
│   │   └── sprite.svg      ← all icons in one file
│   └── img/
│       └── favicon.svg
│
├── build.py                ← partial-resolution build script
└── README.md
```

---

## Editing content

**Most content lives in `pages/`.** Edit a page there, then run:

```bash
python3 build.py
```

That regenerates the flat HTML files at the project root. The flat files
are what gets deployed — they have all partials inlined and the active
nav state set per page.

**Shared elements** (header, footer, `<head>` block) live in
`_partials/`. Edit once, regenerates everywhere.

---

## Design system

Every visual decision in the site routes back to **`assets/css/tokens.css`**.
Don't write hex colors, raw pixel values, or arbitrary easings anywhere
else — use a token. Adding a new token? Put it in `tokens.css` first.

Spacing scale is **4px-based** (`--s-1` = 4px through `--s-11` = 192px).
Type scale uses `clamp()` for fluid responsiveness without media queries.
Color palette: deep harbor navy on warm bone background with aged-brass
accents — "Maritime Authority."

Components live in **`assets/css/components.css`**, organised top-down
(navigation → buttons → cards → forms → footer). Each component has a
numbered comment header so you can ⌘F to it.

---

## Accessibility

- All interactive elements have visible focus rings (`:focus-visible`).
- Skip-to-content link is the first thing in the tab order.
- Mobile menu can be closed with `Escape`.
- FAQ accordions use native `<details>`/`<summary>` — keyboard accessible
  out of the box, indexable by search engines, no JavaScript required.
- `prefers-reduced-motion` is honored both in CSS and in the
  IntersectionObserver-based scroll reveals.
- Schema.org markup: `LocalBusiness` on the homepage, `FAQPage` on the FAQ.

---

## Performance

- No build step ships JavaScript larger than ~1 KB minified.
- Google Maps loads on click (GDPR-friendly + saves ~500 KB on first paint).
- All icons in a single SVG sprite — one HTTP request.
- Fonts loaded with `display=swap` from Google Fonts CDN.
- No images in the design system itself — illustrations are inline SVG.

---

## Deployment

Any static host works. Recommended:

- **Netlify / Cloudflare Pages**: connect the GitHub repo, build command
  `python3 build.py`, publish directory `.`
- **GitHub Pages**: build locally with `python3 build.py`, commit, push.

Since the build output is committed to the repo, you can also deploy
directly without running the build at all — the flat HTML files at the
project root are the deliverable.

---

## License & Credits

© 2025 Κοκοράκη Αλεξάνδρα &amp; Κοκοράκης Γιώργος.

Typography: **Fraunces** (display), **Inter Tight** (body),
**JetBrains Mono** (metadata) — all from Google Fonts.
