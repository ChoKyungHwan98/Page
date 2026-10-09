# CKH / Page — interactive portfolio prototype

An original, lightweight frontend prototype for an aspiring game designer's portfolio. The layout starts from a personal sketch: a steep, black editorial shape on the left and a janggu drummer on the right. Its visual language is influenced by Atlus's strong character-led menu composition and expressive editorial layouts, without using game assets, fonts, source code, or artwork from Atlus.

## Features

- Responsive black/cream landing page with an original inline SVG drummer.
- Subtle idle animation and a deliberately staged **windup → last beat → diagonal ink/print cut → new page** menu transition.
- Working portfolio, résumé, and introduction pages with project links.
- Accessible keyboard-operated rhythm interaction *preview* using Space and Right Arrow, with a short four-beat call-and-response sequence.
- Optional synthesized sound; off by default.
- Reduced-motion support, Escape to exit the rhythm preview, basic focus management, deep links via `#work`, `#resume`, and `#about`.
- Static files only — no install/build step, runtime services, trackers, or backend.

## Preview locally

Open `index.html` in a browser, or run:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main**, **/(root)**, and Save.
4. After deployment is confirmed, visit `https://chokyunghwan98.github.io/Page/`.

If GitHub Pages is disabled or still publishing, the site URL will not work until deployment finishes. The GitHub connector may not have permission to change repository Pages settings; that step can require the owner.

## Prototype scope

This is **not** the finished rhythm game. The home and menu transitions are testable; the Play action provides a minimal rhythm interaction to validate controls and visual feedback. Final character artwork, soundtrack, game pattern rules, real résumé content, and further art direction can be refined later. The résumé/about copy is a prototype summary, not a formal application document.

## Assets and references

All visual graphics and animation code in this repository are original HTML/CSS/SVG/JavaScript created for this prototype. No third-party animation source code has been copied. External references that informed the exploration:

- [21st.dev](https://21st.dev/) — animation-component inspiration.
- [Codrops](https://tympanus.net/codrops/) — experimental page-transition studies.
- [Metaphor: ReFantazio](https://atlus.com/) and [Persona 3 Reload](https://atlus.com/) — character-directed interactive UI and art-direction study. No proprietary artwork included.

## File structure

- `index.html`: all screens and original SVG character
- `styles.css`: typography, composition, animations, responsive styles
- `script.js`: transitions, navigation, Web Audio, rhythm preview
- `README.md`: usage and deployment notes
