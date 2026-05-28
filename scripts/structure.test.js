import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skeleton = JSON.parse(readFileSync(resolve(ROOT, 'data/skeleton.json'), 'utf8'));
const data = JSON.parse(readFileSync(resolve(ROOT, 'src/lib/data/categories.json'), 'utf8'));

const ids = new Set(skeleton.words.map((w) => w.id));

describe('skeleton', () => {
  it('has the expected scale of words', () => {
    expect(skeleton.words.length).toBeGreaterThan(1000);
    expect(skeleton.count).toBe(skeleton.words.length);
  });

  it('every word has a non-empty id and word', () => {
    for (const w of skeleton.words) {
      expect(w.id, JSON.stringify(w)).toBeTruthy();
      expect(w.word).toBeTruthy();
    }
  });

  it('word ids are unique', () => {
    expect(ids.size).toBe(skeleton.words.length);
  });
});

describe('categories.json integrity', () => {
  it('every subgroup word id exists in the skeleton', () => {
    for (const c of data.categories) {
      for (const sg of c.subgroups) {
        expect(sg.words.length, `${sg.id} empty`).toBeGreaterThan(0);
        for (const id of sg.words) expect(ids.has(id), `${id} in ${sg.id}`).toBe(true);
      }
    }
  });

  it('chains, pairs, and traps reference real words', () => {
    for (const ch of data.chains) for (const id of ch.words) expect(ids.has(id)).toBe(true);
    for (const [a, b] of data.pairs) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
    }
    for (const t of data.traps) expect(ids.has(t.word)).toBe(true);
  });

  it('every plan day references real category ids', () => {
    const catIds = new Set(data.categories.map((c) => c.id));
    expect(data.plan.length).toBe(7);
    for (const day of data.plan) {
      expect(day.categories.length).toBeGreaterThan(0);
      for (const id of day.categories) expect(catIds.has(id), `${id}`).toBe(true);
    }
  });
});
