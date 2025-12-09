import Link from 'next/link';
import { ResetPasswordWithTokenForm } from '@/components/auth/ResetPasswordWithTokenForm';

type ResetPasswordWithTokenPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordWithTokenPage({ params }: ResetPasswordWithTokenPageProps) {
  const { token } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-700">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-primary-600">
            Enter your new password below
          </p>
        </div>

        {/* Reset Password Form */}
        <ResetPasswordWithTokenForm token={token} />

        {/* Back link */}
        <div className="text-center">
          <Link href="/auth/signin" className="text-sm text-primary-600 hover:text-primary-700">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

