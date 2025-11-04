import Link from 'next/link';
export default function Home() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">TCG Stats Tracker</h1>
      <Link href="/projects" className="underline">View Projects</Link>
    </main>
  );
}
