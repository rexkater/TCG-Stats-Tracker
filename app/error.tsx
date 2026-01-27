'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4">
      <div className="max-w-md w-full bg-background-200 rounded-lg border border-background-400 p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-primary-700 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-background-200 text-primary-800 rounded-lg hover:bg-background-300 transition-colors font-medium"
          >
            Go to home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

