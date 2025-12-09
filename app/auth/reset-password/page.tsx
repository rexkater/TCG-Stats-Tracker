import Link from 'next/link';
import { ResetPasswordRequestForm } from '@/components/auth/ResetPasswordRequestForm';
import { auth } from '@/auth';

export default async function ResetPasswordPage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-700">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-primary-600">
            {session ? (
              "Enter your current password and new password"
            ) : (
              "Enter your username to receive password reset instructions"
            )}
          </p>
        </div>

        {/* Reset Password Form */}
        <ResetPasswordRequestForm isLoggedIn={!!session} username={session?.user?.username} />

        {/* Back link */}
        <div className="text-center">
          <Link href={session ? "/projects" : "/auth/signin"} className="text-sm text-primary-600 hover:text-primary-700">
            ← Back to {session ? "projects" : "sign in"}
          </Link>
        </div>
      </div>
    </main>
  );
}

