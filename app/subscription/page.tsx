import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SubscriptionForm from '@/components/SubscriptionForm';

export default async function SubscriptionPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/subscription');
  }

  // Get user's current premium status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPremium: true, username: true }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-background-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            Premium Subscription
          </h1>
          <p className="text-primary-700">
            Unlock global analytics and advanced features
          </p>
        </div>

        {user.isPremium ? (
          <div className="bg-background-200 rounded-lg border border-green-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 mb-2">
                You're Premium! 🎉
              </h2>
              <p className="text-primary-700 mb-6">
                You have access to all premium features including the global analytics dashboard.
              </p>
              <a
                href="/analytics"
                className="inline-block bg-accent-300 text-white px-6 py-3 rounded-lg hover:bg-accent-400 transition-colors font-semibold"
              >
                📊 View Analytics Dashboard
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-background-200 rounded-lg border border-background-400 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">
                Premium Features
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-800">Global analytics dashboard across all TCGs</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-800">Aggregated deck performance from all users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-800">Meta snapshots and trending decks</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-800">Time-based performance trends</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-primary-800">Matchup analysis across the community</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-background-400 pt-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                Activate Premium
              </h3>
              <SubscriptionForm userId={session.user.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

