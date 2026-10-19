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

## Le grand ménage du CSS (hands-on activity)

The activity lives at `/tp/` (not linked from the course pages: the trainer shares the URL).
Learners download three files from `public/tp/`: `legacy-enorme.css` (the messy stylesheet to
refactor), `grand-menage-index.html` (a page that uses every component, for visual comparison)
and `verifier.mjs` (a dependency-free script that checks the compiled CSS still contains every
original rule with the same declarations; extra rules are accepted, rule order is not checked).
`src/lib/grand-menage.test.ts` checks the downloads, the script and the page text. Answer keys
and observation notes are trainer-only and never committed here. The page carries `noindex`.
