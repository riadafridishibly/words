// Deterministically parse the GregMat semantic guide + 7-day plan into
// structured JSON. No AI here — just the skeleton (words, group memberships,
// GRE-trap cues, review chains, confusable pairs, study plan).
//
//   data/skeleton.json          -> flat list of every unique word + metadata
//   src/lib/data/categories.json -> full nested structure consumed by the app
//
// Run: npm run parse

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GUIDE = resolve(ROOT, 'gregmat-semantic-study-guide.md');
const PLAN = resolve(ROOT, 'gregmat-7-day-memory-plan.md');

// --- helpers ---------------------------------------------------------------

// Known source typos to correct for a study app.
const TYPO_FIX = {
  'all-ecompassing': 'all-encompassing'
};

function fixWord(w) {
  const k = w.trim().toLowerCase();
  return TYPO_FIX[k] || k;
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// normalized form for fuzzy title matching (plan <-> category)
function norm(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const HEADING = /^##\s+(.+?)\s*$/;
const BOLD_LABEL = /^\*\*(.+?):\*\*\s*(.*)$/;
// backticked word OR a bare word tagged "*(cue only)*"
const TOKEN = /`([^`]+)`|([A-Za-z][A-Za-z-]*)\s*\*\(cue only\)\*/g;
const PAIR = /`([^`]+)`\s+vs\.?\s+`([^`]+)`/g;

const SPECIAL = {
  TRAPS: 'Mixed or Multiple-Meaning GRE Traps',
  CHAINS: 'Ultra-Fast Review Chains'
};

// --- parse the guide -------------------------------------------------------

const guideText = readFileSync(GUIDE, 'utf8');
const lines = guideText.split('\n');

const categories = []; // { id, title, subgroups: [{id,label,words:[id...]}] }
const wordMap = new Map(); // id -> { id, word, source, groups:[], greCue, greTrap }
const chains = []; // { label, words:[id...] }
const traps = []; // { word:id, display, cue }
const pairsSet = new Map(); // key -> [idA, idB]

let curCategory = null;

function ensureWord(rawWord, source) {
  const word = fixWord(rawWord);
  const id = slug(word);
  if (!id) return null;
  let entry = wordMap.get(id);
  if (!entry) {
    entry = { id, word, source, groups: [], greCue: null, greTrap: false };
    wordMap.set(id, entry);
  }
  // a backticked ('list') appearance is authoritative over 'cue'
  if (source === 'list') entry.source = 'list';
  return entry;
}

function extractTokens(content) {
  const out = []; // { word, source }
  TOKEN.lastIndex = 0;
  let m;
  while ((m = TOKEN.exec(content)) !== null) {
    if (m[1] !== undefined) out.push({ word: m[1], source: 'list' });
    else if (m[2] !== undefined) out.push({ word: m[2], source: 'cue' });
  }
  return out;
}

for (const line of lines) {
  // confusable pairs can appear anywhere (intro line)
  PAIR.lastIndex = 0;
  let pm;
  while ((pm = PAIR.exec(line)) !== null) {
    const a = ensureWord(pm[1], 'list');
    const b = ensureWord(pm[2], 'list');
    if (a && b) pairsSet.set(`${a.id}|${b.id}`, [a.id, b.id]);
  }

  const h = line.match(HEADING);
  if (h) {
    const title = h[1];
    if (title === SPECIAL.CHAINS) {
      curCategory = { id: slug(title), title, subgroups: [], special: 'chains' };
    } else if (title === SPECIAL.TRAPS) {
      curCategory = {
        id: slug(title),
        title,
        subgroups: [{ id: slug(title) + '--all', label: 'GRE trap meanings', words: [] }],
        special: 'traps'
      };
      categories.push(curCategory);
    } else {
      curCategory = { id: slug(title), title, subgroups: [] };
      categories.push(curCategory);
    }
    continue;
  }

  if (!curCategory) continue;

  // trap table rows: | `word` | cue text |
  if (curCategory.special === 'traps' && line.trim().startsWith('|')) {
    const cells = line.split('|').map((c) => c.trim());
    // cells[0] is empty (leading pipe). Word cell = cells[1], cue = cells[2]
    const wordCell = cells[1] || '';
    const cueCell = cells[2] || '';
    if (!wordCell || /^-+$/.test(wordCell) || wordCell.toLowerCase() === 'word') continue;
    const toks = extractTokens(wordCell);
    if (!toks.length) continue;
    const entry = ensureWord(toks[0].word, toks[0].source);
    if (!entry) continue;
    entry.greCue = cueCell;
    entry.greTrap = true;
    traps.push({ word: entry.id, display: entry.word, cue: cueCell });
    const sg = curCategory.subgroups[0];
    if (!sg.words.includes(entry.id)) sg.words.push(entry.id);
    entry.groups.push({
      categoryId: curCategory.id,
      categoryTitle: curCategory.title,
      subgroupId: sg.id,
      subgroupLabel: sg.label
    });
    continue;
  }

  const b = line.match(BOLD_LABEL);
  if (b) {
    const label = b[1];
    const content = b[2];
    const toks = extractTokens(content);

    if (curCategory.special === 'chains') {
      const words = toks.map((t) => ensureWord(t.word, t.source)).filter(Boolean).map((e) => e.id);
      if (words.length) chains.push({ label, words });
      continue;
    }

    const sg = { id: curCategory.id + '--' + slug(label), label, words: [] };
    for (const t of toks) {
      const entry = ensureWord(t.word, t.source);
      if (!entry) continue;
      if (!sg.words.includes(entry.id)) sg.words.push(entry.id);
      entry.groups.push({
        categoryId: curCategory.id,
        categoryTitle: curCategory.title,
        subgroupId: sg.id,
        subgroupLabel: label
      });
    }
    if (sg.words.length) curCategory.subgroups.push(sg);
  }
}

// --- parse the 7-day plan --------------------------------------------------

const planText = readFileSync(PLAN, 'utf8');
const planLines = planText.split('\n');
const catByNorm = new Map(categories.map((c) => [norm(c.title), c]));
const plan = [];
let curDay = null;
const unmatchedPlan = [];

for (const line of planLines) {
  // a new ## section ends the day-by-day schedule (e.g. "Final 30-Minute Review")
  if (/^##\s+/.test(line)) {
    curDay = null;
    continue;
  }
  const dayM = line.match(/^\*\*Day\s+(\d+):\s*(.+?)\*\*\s*$/);
  if (dayM) {
    curDay = { day: Number(dayM[1]), title: dayM[2].trim(), categories: [] };
    plan.push(curDay);
    continue;
  }
  if (!curDay) continue;
  const bulletM = line.match(/^\s*-\s+(.+?)\s*$/);
  if (bulletM) {
    const cat = catByNorm.get(norm(bulletM[1]));
    if (cat) curDay.categories.push(cat.id);
    else unmatchedPlan.push(bulletM[1]);
  }
}

// --- assemble + write ------------------------------------------------------

const words = [...wordMap.values()].sort((a, b) => a.word.localeCompare(b.word));

const categoriesOut = {
  categories: categories.map((c) => ({
    id: c.id,
    title: c.title,
    special: c.special || null,
    subgroups: c.subgroups
  })),
  chains,
  pairs: [...pairsSet.values()],
  traps,
  plan
};

const skeleton = {
  generatedFrom: 'gregmat-semantic-study-guide.md',
  count: words.length,
  words
};

mkdirSync(resolve(ROOT, 'data'), { recursive: true });
mkdirSync(resolve(ROOT, 'src/lib/data'), { recursive: true });
writeFileSync(resolve(ROOT, 'data/skeleton.json'), JSON.stringify(skeleton, null, 2));
writeFileSync(
  resolve(ROOT, 'src/lib/data/categories.json'),
  JSON.stringify(categoriesOut, null, 2)
);

// --- report ----------------------------------------------------------------

const listCount = words.filter((w) => w.source === 'list').length;
const cueCount = words.filter((w) => w.source === 'cue').length;
const multiGroup = words.filter((w) => w.groups.length > 1).length;

console.log(`categories:        ${categories.length}`);
console.log(`subgroups:         ${categories.reduce((n, c) => n + c.subgroups.length, 0)}`);
console.log(`unique words:      ${words.length}  (list: ${listCount}, cue-only: ${cueCount})`);
console.log(`in multiple groups:${multiGroup}`);
console.log(`trap words:        ${traps.length}`);
console.log(`review chains:     ${chains.length}`);
console.log(`confusable pairs:  ${pairsSet.size}`);
console.log(`plan days:         ${plan.length}`);
if (unmatchedPlan.length) {
  console.log(`\n⚠ unmatched plan bullets:`);
  for (const u of unmatchedPlan) console.log(`   - ${u}`);
}
const orphans = words.filter((w) => w.groups.length === 0);
if (orphans.length) {
  console.log(`\n⚠ words with no group (${orphans.length}): ${orphans.map((w) => w.word).join(', ')}`);
}
