import Link from 'next/link';

export default async function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-accent-600 hover:text-accent-700">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-primary-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-700">Beta Feedback</h1>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Thank you for testing the TCG Stats Tracker! Your feedback is invaluable in helping us improve the application.
          </p>
          <p className="text-gray-700 mb-4">
            This is a <strong>beta version</strong> of the application. We're actively collecting feedback to prioritize features and improvements for version 2.
          </p>
        </div>

        <div className="bg-background-100 border border-background-300 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700">How to Provide Feedback</h2>
          <div className="space-y-3 text-primary-600">
            <p>
              <strong>GitHub Issues:</strong> Report bugs or request features at{' '}
              <a
                href="https://github.com/rexkater/TCG-Stats-Tracker/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-accent-700 underline"
              >
                github.com/rexkater/TCG-Stats-Tracker/issues
              </a>
            </p>
            <p>
              <strong>Email:</strong> Send detailed feedback to{' '}
              <a
                href="mailto:rex.reyes.rodriguez@gmail.com"
                className="text-accent-600 hover:text-accent-700 underline"
              >
                rex.reyes.rodriguez@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">What We're Looking For</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Bugs or unexpected behavior</li>
            <li>Confusing UI or unclear workflows</li>
            <li>Missing features that would improve your experience</li>
            <li>Performance issues or slow loading times</li>
            <li>Accessibility concerns</li>
            <li>Data accuracy issues in analytics</li>
            <li>Export/import problems</li>
            <li>Mobile usability feedback</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Helpful Information to Include</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>What you were trying to do</li>
            <li>What you expected to happen</li>
            <li>What actually happened</li>
            <li>Steps to reproduce the issue</li>
            <li>Browser and operating system</li>
            <li>Screenshots (if applicable)</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-900">✅ Implemented Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>User Authentication</strong> - Username/password login with session management</li>
            <li><strong>PostgreSQL Database</strong> - Production-ready database hosted on Railway</li>
            <li><strong>Mobile Optimization</strong> - Responsive design with touch-friendly controls</li>
            <li><strong>Multi-Project Support</strong> - Create and manage multiple TCG projects</li>
            <li><strong>Real-time Analytics</strong> - Win rates, matchup analysis, deck performance</li>
            <li><strong>CSV Export/Import</strong> - Full data portability with validation</li>
            <li><strong>Matchup Notes</strong> - Track strategic notes for specific matchups</li>
            <li><strong>Premium Subscription</strong> - Global analytics dashboard (premium feature)</li>
            <li><strong>Copy Last Entry</strong> - Quick data entry by copying previous match info</li>
            <li><strong>Multi-TCG Support</strong> - Riftbound, One Piece, and custom TCGs</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">🚧 Known Limitations & Planned Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>No offline support yet (PWA features planned)</li>
            <li>No automatic data backups (manual CSV export available)</li>
            <li>Analytics calculations are client-side (may be slow with very large datasets)</li>
            <li>No OAuth providers yet (Google/GitHub login planned)</li>
            <li>No project sharing/collaboration features</li>
            <li>No advanced charting/visualization (basic tables only)</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="https://github.com/rexkater/TCG-Stats-Tracker/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
          >
            Report an Issue on GitHub
          </a>
          <a
            href="mailto:rex.reyes.rodriguez@gmail.com?subject=TCG Stats Tracker Beta Feedback"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Send Email Feedback
          </a>
        </div>
      </div>
    </div>
  );
}

