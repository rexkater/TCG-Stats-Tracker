import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import GlobalAnalyticsDashboard from '@/components/GlobalAnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/analytics');
  }

  // Get user's premium status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true, username: true }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user has premium access
  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">
              Premium Feature
            </h1>
            <p className="text-gray-600 mb-8">
              The Global Analytics Dashboard is available to premium subscribers only.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What You'll Get with Premium:
            </h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Global Deck Performance</span>
                  <p className="text-sm text-gray-600">See win rates and statistics for all decks across the community</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Matchup Analysis</span>
                  <p className="text-sm text-gray-600">Discover which decks perform best against each other</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Meta Snapshots</span>
                  <p className="text-sm text-gray-600">Track the most played decks and trending strategies</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Performance Trends</span>
                  <p className="text-sm text-gray-600">View deck performance over time with historical data</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-semibold text-gray-900">Multi-TCG Support</span>
                  <p className="text-sm text-gray-600">Separate analytics for Riftbound, One Piece, and other TCGs</p>
                </div>
              </li>
            </ul>

            <div className="text-center">
              <Link
                href="/subscription"
                className="inline-block bg-accent-600 text-white px-8 py-4 rounded-lg hover:bg-accent-700 transition-colors font-semibold text-lg"
              >
                ⬆️ Upgrade to Premium
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                Unlock global analytics and support the development of TCG Stats Tracker
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User has premium access - show the analytics dashboard
  // Get all TCGs
  const allTcgs = await prisma.tCG.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Sort TCGs in custom order: Riftbound, One Piece, Other
  const tcgOrder = ['Riftbound', 'One Piece', 'Other'];
  const tcgs = allTcgs.sort((a: { name: string }, b: { name: string }) => {
    const aIndex = tcgOrder.indexOf(a.name);
    const bIndex = tcgOrder.indexOf(b.name);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            📊 Global Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Aggregated statistics from all users across the community
          </p>
        </div>

        <GlobalAnalyticsDashboard tcgs={tcgs} />
      </div>
    </div>
  );
}

