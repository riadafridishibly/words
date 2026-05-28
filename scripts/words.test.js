import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skeleton = JSON.parse(readFileSync(resolve(ROOT, 'data/skeleton.json'), 'utf8'));
const words = JSON.parse(readFileSync(resolve(ROOT, 'src/lib/data/words.json'), 'utf8'));

describe('words.json completeness', () => {
  it('covers exactly the skeleton word set', () => {
    expect(words.length).toBe(skeleton.words.length);
    const ids = new Set(words.map((w) => w.id));
    for (const w of skeleton.words) expect(ids.has(w.id), w.id).toBe(true);
  });

  it('every word has a non-empty definition and example', () => {
    for (const w of words) {
      expect(w.definition.length, `${w.word} definition`).toBeGreaterThan(3);
      expect(w.example.length, `${w.word} example`).toBeGreaterThan(3);
    }
  });

  it('every word has a part of speech and at least one synonym', () => {
    for (const w of words) {
      expect(w.pos, `${w.word} pos`).toBeTruthy();
      expect(w.synonyms.length, `${w.word} synonyms`).toBeGreaterThan(0);
    }
  });

  it('no synonym is the word itself', () => {
    for (const w of words) {
      for (const s of w.synonyms) {
        expect(s.toLowerCase(), `${w.word} self-synonym`).not.toBe(w.word.toLowerCase());
      }
    }
  });

  it('trap words keep their GRE cue', () => {
    for (const w of words) {
      if (w.greTrap) expect(w.greCue, `${w.word} cue`).toBeTruthy();
    }
  });
});
