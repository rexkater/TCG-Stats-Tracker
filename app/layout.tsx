import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';

export const metadata = {
  title: 'TCG Stats Tracker',
  description: 'Track your Trading Card Game statistics and performance',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0a0f14',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TCG Stats',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-50 text-primary-900">
        <SessionProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-300 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>

          <Header />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <main id="main-content">
              {children}
            </main>
            <footer className="mt-16 pt-8 border-t border-background-300 text-center text-sm text-primary-700">
              <p>TCG Stats Tracker v1.0.0 beta, developed by Rex Reyes</p>
              <p className="mt-1">
                <a href="/feedback" className="text-accent-500 hover:text-accent-500 underline">
                  Provide Feedback
                </a>
                {' · '}
                <a
                  href="https://github.com/rexkater/TCG-Stats-Tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-500 hover:text-accent-500 underline"
                >
                  GitHub
                </a>
              </p>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}