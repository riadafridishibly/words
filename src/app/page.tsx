import Link from "next/link";
import data from "../../data";

export default async function Home() {
  const res = [];
  const uniq = new Set();
  for (const d of data) {
    if (uniq.has(d.set)) {
      continue;
    }
    uniq.add(d.set);
    res.push(d.set);
  }
  res.sort((a, b) => a - b);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Word Set Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {res.map((id) => (
          <Link
            key={id}
            href={`/word-set/${id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <h2 className="text-xl font-bold">{`Set ${id}`}</h2>
            <p className="mt-2 text-gray-600">
              {data.filter((v) => v.set === id).length} words
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
