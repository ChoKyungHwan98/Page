# Page / V5 Editorial Composition

**Why this revision:** A full poster image with invisible click zones felt like buttons glued onto wallpaper. The approved painting contained baked text, so layering real text directly on top created misaligned marks, and opaque patches damaged its painterly continuity.

**New structure:** Three semantic editorial zones; no illustrative SVG or CSS-drawn character art.
- Left: real Korean navigation, focus/hover states, ink surface and raster brush asset.
- Center: cropped, text-free original scenic art with the janggu character.
- Right: real project directory with thumbnails and proper navigation.
- Mobile: existing native navigation, with text-free scenic crop.
- Keep the existing resume, intro, and portfolio content routes. Project tile activates corresponding section. Main GitHub Pages remains the public entry.

**Art status:** Character still belongs to the approved background painting and is not an independent animated sprite. No false claim of rigging or completed game. A separate layered character asset will be needed before adding a genuine animated drumming performance.

**Motion:** Lightweight Motion microinteractions and subtle scenic movement keyed to menu hover. All navigation is semantic HTML, not transparent image hotspots.

**Source:** Scene and ink raster assets are built from `public/assets/home-art.webp` during GitHub Actions.
