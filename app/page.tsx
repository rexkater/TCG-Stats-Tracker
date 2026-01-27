import Link from 'next/link';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-primary-700">TCG Stats Tracker</h1>
        <p className="text-primary-600 text-base sm:text-lg">Track your Trading Card Game statistics and improve your gameplay</p>
      </div>

      {/* Auth CTAs */}
      {!session ? (
        <div className="bg-background-100 border border-background-300 rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-2 text-primary-700">Get Started Today</h2>
          <p className="mb-6 text-primary-600">Create an account to start tracking your TCG statistics</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/signup"
              className="inline-block bg-accent-300 text-white px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors font-semibold text-center"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors font-semibold text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-900 mb-1">
                Welcome back{session?.user?.username ? `, ${session.user.username}` : ''}!
              </h2>
              <p className="text-green-700">Ready to track your matches?</p>
            </div>
            <Link
              href="/projects"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Go to Projects
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={session ? "/projects" : "/auth/signup"}
          className="block bg-background-200 border border-primary-200 rounded-lg p-6 hover:border-accent-500 hover:shadow-md transition-all touch-manipulation min-h-[100px]"
        >
          <h2 className="text-xl font-semibold mb-2 text-primary-700">📊 Projects</h2>
          <p className="text-primary-600">
            {session ? "View and manage your TCG projects" : "Sign up to create and manage projects"}
          </p>
        </Link>

        <Link
          href="/feedback"
          className="block bg-background-200 border border-primary-200 rounded-lg p-6 hover:border-accent-500 hover:shadow-md transition-all touch-manipulation min-h-[100px]"
        >
          <h2 className="text-xl font-semibold mb-2 text-primary-700">💬 Feedback</h2>
          <p className="text-primary-600">Share your thoughts and report issues</p>
        </Link>
      </div>

      <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🧪</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-primary-700 mb-1">Beta Version</h2>
            <p className="text-primary-600 text-sm sm:text-base">
              This is a beta release. We're actively collecting feedback to improve the application.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-background-100 border border-background-300 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3 text-primary-700">Features</h2>
        <ul className="grid gap-2 md:grid-cols-2 text-primary-600">
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>Track match results and statistics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>Analyze win rates and matchups</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>Matchup notes and strategy tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>CSV export and import</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>Battlefield and initiative tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500">✓</span>
            <span>Best-of-3 series tracking</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
