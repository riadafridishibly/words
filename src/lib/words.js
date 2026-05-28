import categoriesData from './data/categories.json';
import wordsData from './data/words.json';

export const words = wordsData;
export const categories = categoriesData.categories;
export const chains = categoriesData.chains;
export const pairs = categoriesData.pairs;
export const traps = categoriesData.traps;
export const plan = categoriesData.plan;

export const wordById = new Map(words.map((w) => [w.id, w]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));

export const subgroupById = new Map();
for (const c of categories) {
  for (const sg of c.subgroups) {
    subgroupById.set(sg.id, { ...sg, categoryId: c.id, categoryTitle: c.title });
  }
}

export function getWord(id) {
  return wordById.get(id);
}

export function wordsForSubgroup(sgId) {
  const sg = subgroupById.get(sgId);
  if (!sg) return [];
  return sg.words.map((id) => wordById.get(id)).filter(Boolean);
}

// Unique union of all words across a category's subgroups (first-seen order).
export function wordsForCategory(catId) {
  const cat = categoryById.get(catId);
  if (!cat) return [];
  const seen = new Set();
  const out = [];
  for (const sg of cat.subgroups) {
    for (const id of sg.words) {
      if (seen.has(id)) continue;
      seen.add(id);
      const w = wordById.get(id);
      if (w) out.push(w);
    }
  }
  return out;
}

// Case-insensitive substring search over word + definition.
export function searchWords(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts = [];
  const contains = [];
  for (const w of words) {
    const word = w.word.toLowerCase();
    if (word.startsWith(q)) starts.push(w);
    else if (word.includes(q) || (w.definition || '').toLowerCase().includes(q)) contains.push(w);
  }
  return [...starts, ...contains].slice(0, 60);
}
