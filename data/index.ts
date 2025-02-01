import data1_8 from "./group_compact_1_8.json";
import data9_12 from "./group_compact_9_12.json";
import data13_20 from "./group_compact_13_20.json";
import data21_28 from "./group_compact_21_28.json";
import data29_36 from "./group_compact_29_36.json";
import data37_46 from "./group_compact_37_46.json";

// add others
const all = [
  ...data1_8,
  ...data9_12,
  ...data13_20,
  ...data21_28,
  ...data29_36,
  ...data37_46,
];

export async function getUniuqeSetNumbers() {
  const res = [];
  const uniq = new Set();
  for (const d of all) {
    if (uniq.has(d.set)) {
      continue;
    }
    uniq.add(d.set);
    res.push(d.set);
  }
  res.sort((a, b) => a - b);
  return res;
}

export async function countWordsInSet(id: number) {
  return all.filter((v) => v?.set === id).length ?? 0;
}

export async function getWordsForSet(setId: number) {
  const wordsSet = all.filter((v) => v.set === setId);
  return {
    title: `Set ${setId}`,
    words: wordsSet.map((v) => ({
      word: v.word,
      definitions: v.definitions ?? [],
      synonyms: v.synonyms ?? [],
      examples: v.example ?? [],
    })),
  };
}
