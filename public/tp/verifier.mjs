// verifier.mjs : compare ton CSS compilé avec le CSS d'origine.
// Usage : node verifier.mjs legacy-enorme.css style.css
//
// Ce que le script contrôle : chaque règle du fichier d'origine existe toujours
// dans ton CSS, avec exactement les mêmes déclarations. L'ordre des règles, les
// espaces et les majuscules des couleurs n'ont pas d'importance. Les règles que
// tu ajoutes (utilitaires, grille...) sont acceptées et simplement listées.
// Ce qu'il ne contrôle pas : l'ordre des règles qui se contredisent.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function normalizeSelector(selector) {
  return selector.replace(/\s+/g, " ").replace(/\s*([>+~])\s*/g, " $1 ").replace(/\s+/g, " ").trim();
}

function normalizeContext(head) {
  return head.replace(/\s+/g, " ").replace(/:\s+/g, ":").replace(/\s+\)/g, ")").trim();
}

function declarationsOf(body) {
  const set = new Set();
  for (const part of body.split(";")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    const property = part.slice(0, i).trim().toLowerCase();
    const value = part.slice(i + 1).replace(/\s+/g, "").toLowerCase();
    if (property) set.add(`${property}:${value}`);
  }
  return set;
}

/** Returns a Map "context|selector" -> Set of "property:value". */
export function parseRules(css) {
  const rules = new Map();
  const walk = (text, context) => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf("{", i);
      if (open === -1) break;
      const head = text.slice(i, open).trim();
      let depth = 1;
      let j = open + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === "{") depth += 1;
        else if (text[j] === "}") depth -= 1;
        j += 1;
      }
      const body = text.slice(open + 1, j - 1);
      if (head.startsWith("@media")) {
        walk(body, normalizeContext(head));
      } else if (!head.startsWith("@")) {
        const declarations = declarationsOf(body);
        for (const raw of head.split(",")) {
          const selector = normalizeSelector(raw);
          if (!selector) continue;
          const key = `${context}|${selector}`;
          if (!rules.has(key)) rules.set(key, new Set());
          for (const d of declarations) rules.get(key).add(d);
        }
      }
      i = j;
    }
  };
  walk(stripComments(css), "");
  return rules;
}

const label = (key) => {
  const [context, selector] = key.split("|");
  return context ? `${context} { ${selector} }` : selector;
};

export function compareCss(original, candidate) {
  const a = parseRules(original);
  const b = parseRules(candidate);
  const missing = [];
  const changed = [];
  for (const [key, declarations] of a) {
    const other = b.get(key);
    const name = key.split("|")[1];
    if (!other) {
      missing.push(key.startsWith("|") ? name : label(key));
      continue;
    }
    const lost = [...declarations].filter((d) => !other.has(d));
    const extra = [...other].filter((d) => !declarations.has(d));
    if (lost.length || extra.length) {
      changed.push({ selector: key.startsWith("|") ? name : label(key), missing: lost, extra });
    }
  }
  const added = [...b.keys()].filter((key) => !a.has(key)).map((key) => (key.startsWith("|") ? key.slice(1) : label(key)));
  return { ok: missing.length === 0 && changed.length === 0, total: a.size, missing, changed, added };
}

function report(result) {
  const lines = [];
  if (result.ok) {
    lines.push(`OK : les ${result.total} règles du fichier d'origine sont toutes présentes, avec les mêmes déclarations.`);
  } else {
    lines.push(`À revoir : ${result.missing.length + result.changed.length} règle(s) sur ${result.total} ne correspondent pas.`);
  }
  for (const name of result.missing) lines.push(`  Règle absente : ${name}`);
  for (const c of result.changed) {
    lines.push(`  Règle modifiée : ${c.selector}`);
    for (const d of c.missing) lines.push(`    il manque : ${d}`);
    for (const d of c.extra) lines.push(`    en trop : ${d}`);
  }
  if (result.added.length) {
    const sample = result.added.slice(0, 5).join(", ");
    lines.push(`${result.added.length} règle(s) en plus (c'est normal si tu as ajouté des utilitaires) : ${sample}${result.added.length > 5 ? ", ..." : ""}`);
  }
  return lines.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [originalPath, candidatePath] = process.argv.slice(2);
  if (!originalPath || !candidatePath) {
    console.log("Usage : node verifier.mjs legacy-enorme.css style.css");
    process.exit(2);
  }
  try {
    const result = compareCss(readFileSync(originalPath, "utf8"), readFileSync(candidatePath, "utf8"));
    console.log(report(result));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.log(`Impossible de lire un des fichiers : ${error.message}`);
    process.exit(2);
  }
}
