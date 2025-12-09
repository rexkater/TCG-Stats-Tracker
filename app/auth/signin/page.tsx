import Link from 'next/link';
import { SignInForm } from '@/components/auth/SignInForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const session = await auth();
  
  // If already signed in, redirect to projects
  if (session) {
    redirect('/projects');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-700">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-primary-600">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-accent-600 hover:text-accent-700">
              create a new account
            </Link>
          </p>
        </div>

        {/* Sign In Form */}
        <SignInForm />

        {/* Back to home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

