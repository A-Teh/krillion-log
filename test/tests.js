import test from 'node:test'; import assert from 'node:assert/strict';
import { parseKrillion } from '../src/parser.js';
import { allStats, leaders, headToHead } from '../src/stats.js';
test('real sample', () => {
  const r = parseKrillion('Krillion #90 🦐\n260\n\n🐟🫧🫧🦑🦑🐟🦑');
  assert.equal(r.score, 260); assert.equal(r.puzzle, 90); assert.equal(r.breakdown.length, 7); assert.equal(r.depth, null);
});
test('labeled layout with depth', () => {
  const r = parseKrillion('Krillion #91\nScore: 1,100\nDepth: 400m 🌊');
  assert.equal(r.score, 1100); assert.equal(r.depth, 400);
});
test('garbage fails softly', () => { const r = parseKrillion('hello'); assert.equal(r.ok, false); assert.ok(r.warnings.length); });
const R = [['2026-10-11','A',100],['2026-10-12','A',300],['2026-10-12','B',300],['2026-10-13','B',250],['2026-10-11','B',90]]
  .map(([date,player,score]) => ({date,player,score}));
test('stats & streaks', () => {
  const s = allStats(R, ['A','B'], '2026-10-13');
  const A = s.find(x => x.player === 'A'), B = s.find(x => x.player === 'B');
  assert.equal(A.avg, 200); assert.equal(A.currentStreak, 2); assert.equal(B.currentStreak, 3); assert.equal(B.best, 300);
});
test('leader ties and waiting', () => {
  const l = leaders(R, ['A','B','C'], '2026-10-12');
  assert.deepEqual(l.leaders, ['A','B']); assert.deepEqual(l.waiting, ['C']);
});
test('head to head', () => assert.deepEqual(headToHead(R, 'A', 'B'), { A: 1, B: 0, ties: 1 }));
