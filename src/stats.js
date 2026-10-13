// results: [{date:'YYYY-MM-DD', player, score, depth}]
const day = d => Date.parse(d + 'T00:00:00Z') / 864e5;
export const addDays = (d, n) => new Date((day(d) + n) * 864e5).toISOString().slice(0, 10);

export function playerStats(results, player, today) {
  const rs = results.filter(r => r.player === player);
  const dates = [...new Set(rs.map(r => r.date))].sort();
  const set = new Set(dates);
  let longest = 0, run = 0, prev = null;
  for (const d of dates) { run = prev && day(d) - day(prev) === 1 ? run + 1 : 1; longest = Math.max(longest, run); prev = d; }
  let cur = 0, c = set.has(today) ? today : addDays(today, -1); // not having played yet today doesn't break the streak
  while (set.has(c)) { cur++; c = addDays(c, -1); }
  const total = rs.reduce((a, r) => a + r.score, 0);
  return { player, games: rs.length, avg: rs.length ? total / rs.length : 0,
    best: rs.length ? Math.max(...rs.map(r => r.score)) : 0, currentStreak: cur, longestStreak: longest };
}
export const allStats = (results, players, today, sortBy = 'avg') =>
  players.map(p => playerStats(results, p, today)).sort((a, b) => b[sortBy] - a[sortBy]);

export function leaders(results, players, today) {
  const t = results.filter(r => r.date === today);
  const top = t.length ? Math.max(...t.map(r => r.score)) : null;
  const done = new Set(t.map(r => r.player));
  return { top, leaders: t.filter(r => r.score === top).map(r => r.player), // ties: show all
    waiting: players.filter(p => !done.has(p)) };
}

export function headToHead(results, a, b) {
  const m = new Map();
  for (const r of results) if (r.player === a || r.player === b) { if (!m.has(r.date)) m.set(r.date, {}); m.get(r.date)[r.player] = r.score; }
  let aw = 0, bw = 0, ties = 0;
  for (const v of m.values()) if (v[a] != null && v[b] != null) v[a] > v[b] ? aw++ : v[a] < v[b] ? bw++ : ties++;
  return { [a]: aw, [b]: bw, ties };
}
