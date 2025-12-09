'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPasswordResetAction, changePasswordAction } from '@/app/auth/actions';

type ResetPasswordRequestFormProps = {
  isLoggedIn: boolean;
  username?: string;
};

export function ResetPasswordRequestForm({ isLoggedIn, username }: ResetPasswordRequestFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (isLoggedIn) {
        // Change password for logged-in user
        const result = await changePasswordAction(formData);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('Password changed successfully!');
          setTimeout(() => {
            router.push('/projects');
          }, 2000);
        }
      } else {
        // Request password reset for non-logged-in user
        const result = await requestPasswordResetAction(formData);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess(result.message || 'Password reset instructions sent!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="bg-white border border-primary-200 rounded-lg p-6 shadow-sm space-y-4">
        {!isLoggedIn && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
              placeholder="Enter your username"
            />
          </div>
        )}

        {isLoggedIn && (
          <>
            <input type="hidden" name="username" value={username} />

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-primary-700 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-primary-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                placeholder="Enter new password"
              />
              <p className="mt-1 text-xs text-primary-500">
                Min 8 characters, uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-secondary-50 border border-secondary-300 p-4">
          <p className="text-sm text-secondary-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 border border-green-300 p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : isLoggedIn ? 'Change Password' : 'Send Reset Instructions'}
      </button>
    </form>
  );
}

