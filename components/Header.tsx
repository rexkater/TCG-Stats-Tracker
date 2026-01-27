'use client';

import { useSession } from 'next-auth/react';
import UserNav from './UserNav';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-background-200 border-b border-background-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-900">
            <a href="/" className="hover:text-primary-800">TCG Stats Tracker</a>
          </h1>
          {session?.user?.username && (
            <UserNav
              username={session.user.username}
              isPremium={session.user.isPremium || false}
            />
          )}
        </div>
      </div>
    </header>
  );
}

