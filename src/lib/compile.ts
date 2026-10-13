import * as sass from "sass";

export type CompileResult =
  | { ok: true; css: string }
  | { ok: false; message: string; line?: number; column?: number };

export interface CompileOptions {
  /** In-memory files that @use can resolve, keyed by file name (e.g. "_variables.scss"). */
  files?: Record<string, string>;
}

function memoryImporter(files: Record<string, string>): sass.Importer<"sync"> {
  const find = (url: string) => {
    const name = url.split("/").pop() ?? url;
    return [`_${name}.scss`, `${name}.scss`].find((key) => key in files);
  };
  return {
    canonicalize: (url) => {
      const key = find(url);
      return key ? new URL(`memory:${key}`) : null;
    },
    load: (canonicalUrl) => ({
      contents: files[canonicalUrl.pathname],
      syntax: "scss",
    }),
  };
}

export function compileScss(source: string, options: CompileOptions = {}): CompileResult {
  try {
    const { css } = sass.compileString(source, {
      logger: sass.Logger.silent,
      importers: options.files ? [memoryImporter(options.files)] : [],
    });
    return { ok: true, css };
  } catch (error) {
    const e = error as { sassMessage?: string; message: string; span?: { start: { line: number; column: number } } };
    return {
      ok: false,
      message: e.sassMessage ?? e.message,
      line: e.span ? e.span.start.line + 1 : undefined,
      column: e.span ? e.span.start.column + 1 : undefined,
    };
  }
}
