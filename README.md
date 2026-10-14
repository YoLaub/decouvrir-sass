# Découvrir Sass

Course companion site for a one-day Sass introduction (CDA training): one page per
topic, with a live SCSS editor that compiles in the browser, plus a self-check.

Live site: https://yolaub.github.io/decouvrir-sass/

## Develop

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests (compile wrapper, page navigation)
npm run build   # static site in dist/
```

Sass runs client-side (the `sass` package is bundled), so the site is fully static.
Pushing to `main` deploys it through GitHub Actions.

## Adding a page

Create `src/pages/<slug>.astro` and add the slug to `src/lib/pages.ts`, which drives the
index and the previous/next navigation.

## Sauvetage du CSS legacy (hands-on activity)

The activity lives at `/tp/` (not linked from the course pages: the trainer shares the URL).
Starter files are defined once in `src/lib/sauvetage.ts` and mirrored in `public/tp/` for
download; a test keeps both in sync and checks the starter compiles and the effects partial
fails with a readable error. Answer keys and observation notes are trainer-only and never
committed here. The page carries `noindex`.
