import { getUniuqeSetNumbers, getWordsForSet } from "@data/index";
import Flashcard from "../../../components/Flashcard";

type tParams = Promise<{ id: string }>;

export default async function WordSetPage(props: { params: tParams }) {
  const { id } = await props.params;
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

export async function generateStaticParams() {
  const ids = await getUniuqeSetNumbers();
  return ids.map((v) => ({
    id: `${v}`,
  }));
}
