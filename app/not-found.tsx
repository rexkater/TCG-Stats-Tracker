import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4">
      <div className="max-w-md w-full bg-background-200 rounded-lg border border-background-400 p-8 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">
            Page not found
          </h1>
          <p className="text-primary-700 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-secondary-300 text-white rounded-lg hover:bg-secondary-400 transition-colors font-medium"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}

