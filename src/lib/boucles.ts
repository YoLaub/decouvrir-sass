/** Editable examples of the "loops, functions and conditions" page, compiled by the tests. */

export const examples = {
  each: `$couleurs: (
  'primary': #2c5aa0,
  'danger': #c0392b,
  'success': #27ae60,
);

@each $nom, $couleur in $couleurs {
  .btn-#{$nom} {
    background: $couleur;
    border: 1px solid $couleur;
    color: white;
  }
}
`,

  for: `$espace: 8px;

@for $i from 1 through 5 {
  .mt-#{$i} { margin-top: $espace * $i; }
  .p-#{$i} { padding: $espace * $i; }
}
`,

  grid: `@use 'sass:math';

@for $i from 1 through 12 {
  .col-#{$i} {
    width: math.div($i, 12) * 100%;
  }
}
`,

  function: `@use 'sass:math';

@function rem($px, $base: 16) {
  @return math.div($px, $base) * 1rem;
}

h1 { font-size: rem(32); }
h2 { font-size: rem(24); }
p { margin-bottom: rem(12); }
`,

  if: `@mixin alerte($niveau) {
  padding: 12px 16px;

  @if $niveau == 'erreur' {
    color: #c0392b;
    background: #fdecea;
  } @else if $niveau == 'succes' {
    color: #27ae60;
    background: #eafaf1;
  } @else {
    color: #2c5aa0;
    background: #eaf1fb;
  }
}

.alerte-erreur { @include alerte('erreur'); }
.alerte-succes { @include alerte('succes'); }
.alerte-info { @include alerte('info'); }
`,

  content: `@use 'sass:map';

$points: (
  'tablette': 768px,
  'mobile': 480px,
);

@mixin sous($nom) {
  @media (max-width: map.get($points, $nom)) {
    @content;
  }
}

.sidebar {
  width: 240px;

  @include sous('tablette') {
    width: 100%;
  }
}
`,

  themes: `@use 'sass:map';

$themes: (
  'clair': ('fond': #ffffff, 'texte': #222222),
  'sombre': ('fond': #1a1a1a, 'texte': #eeeeee),
);

@each $nom, $t in $themes {
  .theme-#{$nom} {
    background: map.get($t, 'fond');
    color: map.get($t, 'texte');
  }
}
`,
};
