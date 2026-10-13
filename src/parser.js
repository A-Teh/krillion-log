// Tolerant parser for Krillion share text. Never throws; returns {ok, score, depth, puzzle, breakdown, warnings}.
export function parseKrillion(text) {
  const out = { ok: false, score: null, depth: null, puzzle: null, breakdown: [], warnings: [] };
  if (!text || !text.trim()) { out.warnings.push('Empty input'); return out; }
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const p = text.match(/krillion\s*#?\s*(\d+)/i);
  if (p) out.puzzle = +p[1];
  const d = text.match(/(\d[\d,]*)\s*(?:m|meters?|metres?)\b/i);
  if (d) out.depth = +d[1].replace(/,/g, '');
  let s = text.match(/score\D{0,3}(\d[\d,]*)/i) || text.match(/(\d[\d,]*)\s*(?:pts?|points?)\b/i);
  if (!s) { const l = lines.find(l => /^\d[\d,]*$/.test(l)); if (l) s = [l, l]; }
  if (s) out.score = +s[1].replace(/,/g, '');
  const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
  for (const l of lines) {
    if (/[\p{L}\p{N}]/u.test(l)) continue;
    out.breakdown.push(...[...seg.segment(l)].map(g => g.segment).filter(g => g.trim()));
  }
  if (out.breakdown.length && out.breakdown.length !== 7) out.warnings.push(`Expected 7 breakdown symbols, found ${out.breakdown.length}`);
  if (out.score == null) out.warnings.push('Could not find a score');
  out.ok = out.score != null;
  return out;
}
