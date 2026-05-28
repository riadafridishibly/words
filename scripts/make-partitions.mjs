// Partition every skeleton word into chunks for parallel enrichment. Each word
// is enriched exactly once and carries its own sense context (subgroup labels +
// GRE cue), so packing across categories is fine. Words are kept in category
// order so neighbours within a chunk are usually related.
//
//   data/parts/<partitionId>.json  -> input for one enrichment agent
//   data/parts/index.json          -> list of partitions + coverage stats
//
// Run: node scripts/make-partitions.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skeleton = JSON.parse(readFileSync(resolve(ROOT, 'data/skeleton.json'), 'utf8'));

const CHUNK = 44;

// flat list in category order, each word with the sense context it needs
const flat = skeleton.words
  .map((w) => ({
    id: w.id,
    word: w.word,
    senses: [...new Set(w.groups.map((g) => g.subgroupLabel))],
    catTitle: w.groups[0]?.categoryTitle || 'Miscellaneous',
    greCue: w.greCue || null,
    _sort: w.groups[0]?.categoryTitle || 'zzz'
  }))
  .sort((a, b) => (a._sort < b._sort ? -1 : a._sort > b._sort ? 1 : a.word.localeCompare(b.word)));

const partitions = [];
for (let i = 0; i < flat.length; i += CHUNK) {
  const slice = flat.slice(i, i + CHUNK).map(({ _sort, ...rest }) => rest);
  const n = String(partitions.length + 1).padStart(2, '0');
  partitions.push({ id: `p${n}`, words: slice });
}

const partsDir = resolve(ROOT, 'data/parts');
rmSync(partsDir, { recursive: true, force: true });
mkdirSync(partsDir, { recursive: true });
for (const p of partitions) {
  writeFileSync(resolve(partsDir, `${p.id}.json`), JSON.stringify(p, null, 2));
}
const index = partitions.map((p) => ({ id: p.id, count: p.words.length }));
writeFileSync(resolve(partsDir, 'index.json'), JSON.stringify({ partitions: index }, null, 2));

const total = partitions.reduce((n, p) => n + p.words.length, 0);
console.log(`partitions: ${partitions.length}`);
console.log(`words covered: ${total} (skeleton has ${skeleton.words.length})`);
console.log(`partition ids: ${partitions.map((p) => p.id).join(' ')}`);
