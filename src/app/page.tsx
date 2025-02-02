import Link from "next/link";
import { countWordsInSet, getUniuqeSetNumbers } from "../../data";
import { ModeToggle } from "~/components/ModeToggle";

export default async function Home() {
  const res = await getUniuqeSetNumbers();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">GRE Words (gregmat)</h1>
        <ModeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {res.map((id) => (
          <Link
            key={id}
            href={`/set/${id}`}
            className="block p-6  rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <h2 className="text-xl font-bold">{`Set ${id}`}</h2>
            <p className="mt-2 text-gray-600">{countWordsInSet(id)} words</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
