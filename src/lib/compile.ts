import * as sass from "sass";

export type CompileResult =
  | { ok: true; css: string }
  | { ok: false; message: string; line?: number; column?: number };

export function compileScss(source: string): CompileResult {
  try {
    const { css } = sass.compileString(source, { logger: sass.Logger.silent });
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
