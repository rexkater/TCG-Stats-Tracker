'use client';

import { useState } from 'react';
import { signInAction } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await signInAction(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        // Success - update session and redirect
        await update();
        router.push('/projects');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-secondary-50 border border-secondary-300 text-secondary-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Credentials Form */}
      <form action={handleSubmit} className="space-y-6 bg-white border border-primary-200 rounded-lg p-6 shadow-sm">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-primary-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:bg-primary-50 disabled:cursor-not-allowed text-primary-900"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-primary-700">
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-sm text-accent-600 hover:text-accent-700"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:bg-primary-50 disabled:cursor-not-allowed text-primary-900"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

