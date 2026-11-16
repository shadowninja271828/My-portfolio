# Crown: React Developer Portfolio

Vite + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion + lucide-react. Fonts are self-hosted via Fontsource.

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
```

## Editing content
All copy lives in [`src/data/content.ts`](src/data/content.ts). Anything containing `TODO` is a placeholder and shows a dashed orange marker in dev. Empty `experience`, `education`, `testimonials`, `faq` arrays hide their sections; empty `socials` entries are not rendered.

## Swap the photo
Drop a ~3:4 portrait at `public/assets/crown.jpg` (or change `photo` in `content.ts`). A placeholder shows if the file is missing.

## Swap projects
Edit `projects` in `content.ts`. Put 16:10 `.webp` screenshots in `public/assets/projects/` and set `image: '/assets/projects/foo.webp'`. Set `projectsLayout: 'carousel'` for the swipe/keyboard carousel instead of the grid.

## Colors and fonts
Tokens are CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css) (`--orange`, `--lime`, `--bg`, ...) and are exposed to Tailwind via `@theme`. Fonts are imported in `src/main.tsx`.
Note: the hero/section "ghost" text uses `#4a4947` rather than `--ghost` (`#2b2a29`), which is nearly invisible on `--bg`.

## Pixel scene
`heroVisual` in `content.ts`: `'pixelScene'` or `'none'`. To replace the art, edit `src/components/PixelScene.tsx` (a 32x24 SVG grid), or swap it for an `<img>`.

## Contact form backend
`src/components/ContactForm.tsx` picks a backend from `.env`:
- Formspree: `VITE_FORMSPREE_ID=xxxx`
- EmailJS: `VITE_EMAILJS_SERVICE`, `VITE_EMAILJS_TEMPLATE`, `VITE_EMAILJS_KEY`
- Neither set: a mock send (logs to the console) so the UI still works.

## Notes
- lucide-react v1 has no brand icons, so socials use generic icons (see `Socials.tsx`).
- TODO: OG image (`index.html`).
