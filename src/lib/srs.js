// Lightweight Leitner spaced repetition.
//
// A word's progress record: { status, box, dueAt, seen, correct, updatedAt }
//   box    0..4  — Leitner box (higher = better known, longer interval)
//   status 'new' | 'unknown' | 'learning' | 'known' (derived from box + grade)
//   dueAt  timestamp (ms) when the word should next surface in review
//
// Grades from the flashcard: 'again' (don't know), 'hard' (almost), 'good' (know it).

const DAY = 24 * 60 * 60 * 1000;
// interval before a word in each box is due again
export const INTERVALS = [0, 1 * DAY, 2 * DAY, 4 * DAY, 9 * DAY];
export const MAX_BOX = INTERVALS.length - 1;

export function statusForBox(box) {
  if (box <= 0) return 'unknown';
  if (box < 3) return 'learning';
  return 'known';
}

export function grade(prev, g, now) {
  const cur = prev?.box ?? 0;
  let box;
  if (g === 'again') box = 0;
  else if (g === 'hard') box = Math.max(0, cur - 1);
  else box = Math.min(MAX_BOX, cur + 1);

  let status;
  if (g === 'again') status = 'unknown';
  else if (box === 0) status = 'learning';
  else status = statusForBox(box);

  return {
    status,
    box,
    dueAt: now + INTERVALS[box],
    seen: (prev?.seen ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (g === 'good' ? 1 : 0),
    updatedAt: now
  };
}

export function statusOf(rec) {
  return rec?.status ?? 'new';
}

// A previously-seen word is "due" once its dueAt has passed.
export function isDue(rec, now) {
  return !!rec && rec.dueAt <= now;
}

// Count words by status given a progress map and a list of word ids.
export function tally(ids, progressMap) {
  const counts = { new: 0, unknown: 0, learning: 0, known: 0 };
  for (const id of ids) counts[statusOf(progressMap[id])]++;
  return counts;
}
