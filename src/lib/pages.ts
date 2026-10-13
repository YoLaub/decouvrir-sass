export interface Page { slug: string; title: string }

export const pages: Page[] = [
  { slug: "variables", title: "Variables" },
  { slug: "imbrication", title: "Imbrication" },
  { slug: "partials", title: "Partials et @use" },
  { slug: "mixins-extend", title: "Mixins et @extend" },
  { slug: "compilation", title: "Compiler et diagnostiquer" },
  { slug: "evaluation", title: "Teste tes acquis" },
  { slug: "aller-plus-loin", title: "Aller plus loin" },
];

export function neighbors(slug: string): { prev?: Page; next?: Page } {
  const i = pages.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: pages[i - 1], next: pages[i + 1] };
}
