import { wordSets } from "../../../lib/data";
import Flashcard from "../../../components/Flashcard";

type tParams = Promise<{ id: string[] }>;

export default async function WordSetPage(props: { params: tParams }) {
  const res = await props.params;
  console.log('slug', res)
  const wordSet = wordSets.find((set) => set.id === Number.parseInt(res.id[0]));

  if (!wordSet) {
    return <div>Word set not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{wordSet.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wordSet.words.map((word) => (
          <Flashcard
            key={word.id}
            word={word.word}
            definition={word.definition}
          />
        ))}
      </div>
    </div>
  );
}
