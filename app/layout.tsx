import './globals.css';

export const metadata = {
  title: 'TCG Stats Tracker',
  description: 'Track your Trading Card Game statistics and performance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main id="main-content">
            {children}
          </main>
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>TCG Stats Tracker v1.0.0-beta</p>
            <p className="mt-1">
              <a href="/feedback" className="text-blue-600 hover:text-blue-800 underline">
                Provide Feedback
              </a>
              {' · '}
              <a
                href="https://github.com/rexkater/TCG-Stats-Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}