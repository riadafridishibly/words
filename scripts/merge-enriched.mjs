// Merge agent-generated enrichment files with the authoritative skeleton into
// the final src/lib/data/words.json, then report coverage gaps.
//
//   reads  data/skeleton.json, data/enriched/*.json
//   writes src/lib/data/words.json
//          data/missing.json  (ids still needing enrichment)
//
// Run: node scripts/merge-enriched.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skeleton = JSON.parse(readFileSync(resolve(ROOT, 'data/skeleton.json'), 'utf8'));
const enrichedDir = resolve(ROOT, 'data/enriched');

function parseLoose(text) {
  // tolerate accidental code fences or {words:[...]} wrappers
  let t = text.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  const data = JSON.parse(t);
  return Array.isArray(data) ? data : Array.isArray(data.words) ? data.words : [];
}

const enriched = new Map();
let fileCount = 0;
const badFiles = [];
if (existsSync(enrichedDir)) {
  for (const f of readdirSync(enrichedDir)) {
    if (!f.endsWith('.json')) continue;
    fileCount++;
    try {
      for (const e of parseLoose(readFileSync(resolve(enrichedDir, f), 'utf8'))) {
        if (e && e.id) enriched.set(e.id, e);
      }
    } catch (err) {
      badFiles.push(`${f}: ${err.message}`);
    }
  }
}

const isFilled = (e) =>
  e && typeof e.definition === 'string' && e.definition.trim().length > 3 &&
  typeof e.example === 'string' && e.example.trim().length > 3;

// optional corrections layer (from the verification pass): field overrides by id
const corrections = new Map();
const corrDir = resolve(ROOT, 'data/corrections');
if (existsSync(corrDir)) {
  for (const f of readdirSync(corrDir)) {
    if (!f.endsWith('.json')) continue;
    try {
      for (const c of parseLoose(readFileSync(resolve(corrDir, f), 'utf8'))) {
        if (c && c.id) corrections.set(c.id, { ...(corrections.get(c.id) || {}), ...c });
      }
    } catch (err) {
      badFiles.push(`corrections/${f}: ${err.message}`);
    }
  }
}

const out = [];
const missing = [];
for (const w of skeleton.words) {
  let e = enriched.get(w.id);
  const c = corrections.get(w.id);
  if (c) {
    e = { ...e };
    if (typeof c.definition === 'string' && c.definition.trim()) e.definition = c.definition;
    if (typeof c.example === 'string' && c.example.trim()) e.example = c.example;
    if (Array.isArray(c.synonyms) && c.synonyms.length) e.synonyms = c.synonyms;
    if (typeof c.mnemonic === 'string' && c.mnemonic.trim()) e.mnemonic = c.mnemonic;
    if (typeof c.confusableNote === 'string') e.confusableNote = c.confusableNote;
  }
  const filled = isFilled(e);
  if (!filled) missing.push(w.id);
  out.push({
    id: w.id,
    word: w.word,
    pos: (e?.pos || '').trim(),
    definition: (e?.definition || '').trim(),
    example: (e?.example || '').trim(),
    synonyms: Array.isArray(e?.synonyms)
      ? e.synonyms.filter((s) => s && s.toLowerCase() !== w.word.toLowerCase()).slice(0, 5)
      : [],
    mnemonic: (e?.mnemonic || '').trim(),
    confusableNote: (e?.confusableNote || '').trim(),
    greTrap: w.greTrap,
    greCue: w.greCue,
    source: w.source,
    groups: w.groups,
    primaryGroup: w.groups[0]?.subgroupLabel || null,
    enriched: filled
  });
}

writeFileSync(resolve(ROOT, 'src/lib/data/words.json'), JSON.stringify(out));
writeFileSync(resolve(ROOT, 'data/missing.json'), JSON.stringify({ count: missing.length, ids: missing }, null, 2));

console.log(`enriched files read: ${fileCount}  (entries: ${enriched.size})`);
if (badFiles.length) {
  console.log(`⚠ unparseable files:`);
  for (const b of badFiles) console.log('   - ' + b);
}
console.log(`words.json written: ${out.length}`);
console.log(`filled: ${out.length - missing.length}   MISSING: ${missing.length}`);
if (missing.length) console.log(`missing ids (first 40): ${missing.slice(0, 40).join(', ')}`);
