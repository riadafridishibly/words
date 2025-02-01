import Link from "next/link";
import { wordSets } from "../lib/data";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Word Set Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wordSets.map((set) => (
          <Link
            key={set.id}
            href={`/word-set/${set.id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <h2 className="text-xl font-bold">{set.title}</h2>
            <p className="mt-2 text-gray-600">{set.words.length} words</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
