import Link from 'next/link';

export default async function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-6">Beta Feedback</h1>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Thank you for testing the TCG Stats Tracker! Your feedback is invaluable in helping us improve the application.
          </p>
          <p className="text-gray-700 mb-4">
            This is a <strong>beta version</strong> of the application. We're actively collecting feedback to prioritize features and improvements for version 2.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">How to Provide Feedback</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>GitHub Issues:</strong> Report bugs or request features at{' '}
              <a 
                href="https://github.com/rexkater/TCG-Stats-Tracker/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                github.com/rexkater/TCG-Stats-Tracker/issues
              </a>
            </p>
            <p>
              <strong>Email:</strong> Send detailed feedback to{' '}
              <a 
                href="mailto:rex.reyes@upr.edu" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                rex.reyes@upr.edu
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">Known Limitations (Beta)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Currently using SQLite database (will migrate to PostgreSQL for production)</li>
            <li>No user authentication yet (single-user mode)</li>
            <li>No data backup/restore functionality</li>
            <li>Limited mobile optimization</li>
            <li>No offline support yet</li>
            <li>Analytics calculations are client-side (may be slow with large datasets)</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="https://github.com/rexkater/TCG-Stats-Tracker/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Report an Issue on GitHub
          </a>
          <a
            href="mailto:rex.reyes@upr.edu?subject=TCG Stats Tracker Beta Feedback"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Send Email Feedback
          </a>
        </div>
      </div>
    </div>
  );
}

