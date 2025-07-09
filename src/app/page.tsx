import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Family Feud</h1>
      <div className="flex gap-6">
        <Link
          href="/admin"
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-full text-xl transition-colors"
        >
          Admin Dashboard
        </Link>
        <Link
          href="/live"
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-full text-xl transition-colors"
        >
          Live Board
        </Link>
      </div>
    </div>
  );
}
