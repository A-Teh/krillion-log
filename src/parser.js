// Tolerant parser for Krillion share text. Never throws.
export const TIERS = {
  '⬛': { label: 'Miss', min: 0, max: 0 },
  '🫧': { label: 'Plankton', min: 1, max: 150 },
  '🐟': { label: 'Schooler', min: 151, max: 250 },
  '🦑': { label: 'Rare', min: 251, max: 350 },
  '🏮': { label: 'Deep cut', min: 351, max: 449 },
  '🌟': { label: 'One in a krillion', min: 450, max: Infinity },
};

export function parseKrillion(text) {
  const out = { ok: false, score: null, depth: null, puzzle: null, breakdown: [], warnings: [] };
  if (!text || !text.trim()) { out.warnings.push('Empty input'); return out; }
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const p = text.match(/krillion\s*#?\s*(\d+)/i);
  if (p) out.puzzle = +p[1];

  let s = text.match(/score\D{0,3}(\d[\d,]*)/i) || text.match(/(\d[\d,]*)\s*(?:pts?|points?)\b/i);
  if (!s) { const l = lines.find(l => /^\d[\d,]*$/.test(l)); if (l) s = [l, l]; }
  if (s) out.score = +s[1].replace(/,/g, '');

  // Depth is always 10x score; it is never parsed from the text.
  if (out.score != null) out.depth = out.score * 10;

  const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
  for (const l of lines) {
    if (/[\p{L}\p{N}]/u.test(l)) continue;
    for (const { segment } of seg.segment(l)) {
      if (!segment.trim()) continue;
      if (TIERS[segment]) out.breakdown.push({ emoji: segment, label: TIERS[segment].label });
      else out.warnings.push(`Unknown symbol: ${segment}`);
    }
  }
  if (out.breakdown.length && out.breakdown.length !== 7)
    out.warnings.push(`Expected 7 symbols, found ${out.breakdown.length}`);
  if (out.score == null) out.warnings.push('Could not find a score');
  out.ok = out.score != null;
  return out;
}