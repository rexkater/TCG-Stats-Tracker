import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">TCG Stats Tracker</h1>
        <p className="text-gray-600 text-lg">Track your Trading Card Game statistics and improve your gameplay</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧪</span>
          <div>
            <h2 className="font-semibold text-yellow-900 mb-1">Beta Version</h2>
            <p className="text-yellow-800 mb-3">
              This is a beta release. We're actively collecting feedback to improve the application.
            </p>
            <Link
              href="/feedback"
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Provide Feedback
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/projects"
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Projects</h2>
          <p className="text-gray-600">View and manage your TCG projects</p>
        </Link>

        <Link
          href="/feedback"
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">💬 Feedback</h2>
          <p className="text-gray-600">Share your thoughts and report issues</p>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-900">Features</h2>
        <ul className="grid gap-2 md:grid-cols-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Track match results and statistics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Analyze win rates and matchups</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Matchup notes and strategy tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>CSV export and import</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Battlefield and initiative tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>Best-of-3 series tracking</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
