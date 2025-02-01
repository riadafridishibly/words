import Flashcard from "../../../components/Flashcard";
import words from "@data/index";

type tParams = Promise<{ id: string[] }>;

export default async function WordSetPage(props: { params: tParams }) {
  const { id: ids } = await props.params;
  const id = ids[0];
  const wordSet = await getWordsForSet(Number.parseInt(id));

  if (!wordSet) {
    return <div>Word set not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{wordSet.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wordSet.words.map((word) => (
          <Flashcard
            key={word.word}
            word={word.word}
            definitions={word.definitions}
            synonyms={word.synonyms}
            examples={word.examples}
          />
        ))}
      </div>
    </div>
  );
}

async function getWordsForSet(setId: number) {
  const wordsSet = words.filter((v) => v.set === setId);
  return {
    title: `Set ${setId}`,
    words: wordsSet.map((v) => ({
      word: v.word,
      definitions: v.definitions,
      synonyms: v.synonyms,
      examples: v.example,
    })),
  };
}
