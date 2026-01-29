'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

type UserNavProps = {
  username: string;
  isPremium?: boolean;
};

export default function UserNav({ username, isPremium = false }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Sign Out Button - Always Visible */}
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-sm font-medium text-white bg-accent-300 hover:bg-accent-400 rounded-lg transition-colors"
      >
        Sign Out
      </button>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-300 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-accent-300 text-white flex items-center justify-center font-semibold">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-primary-900">
            {username}
          </span>
          <svg
            className={`w-4 h-4 text-primary-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50"
            style={{
              backgroundColor: '#1a2332 !important',
              borderColor: '#2d3f54',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div className="px-4 py-2" style={{ borderBottom: '1px solid #2d3f54' }}>
              <p className="text-sm font-medium" style={{ color: '#ffffff !important' }}>{username}</p>
            </div>

            <Link
              href="/projects"
              className="block px-4 py-2 text-sm"
              style={{ color: '#ffffff !important', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e2a3a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              onClick={() => setIsOpen(false)}
            >
              📊 Projects
            </Link>

            {/* Only show Analytics and Premium/Upgrade for premium users */}
            {isPremium && (
              <>
                <Link
                  href="/analytics"
                  className="block px-4 py-2 text-sm"
                  style={{ color: '#ffffff !important', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e2a3a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onClick={() => setIsOpen(false)}
                >
                  📈 Analytics
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d23b44', color: '#ffffff' }}>
                    Premium
                  </span>
                </Link>

                <Link
                  href="/subscription"
                  className="block px-4 py-2 text-sm"
                  style={{ color: '#ffffff !important', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e2a3a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onClick={() => setIsOpen(false)}
                >
                  ⭐ Premium
                </Link>
              </>
            )}

            <Link
              href="/auth/reset-password"
              className="block px-4 py-2 text-sm"
              style={{ color: '#ffffff !important', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e2a3a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              onClick={() => setIsOpen(false)}
            >
              🔑 Reset Password
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

