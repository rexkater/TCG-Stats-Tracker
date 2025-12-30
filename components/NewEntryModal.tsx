'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NewEntryModalProps {
  projectId: string;
  hasEntries: boolean;
  onClose: () => void;
}

export default function NewEntryModal({ projectId, hasEntries, onClose }: NewEntryModalProps) {
  const router = useRouter();

  const handleStartFresh = () => {
    router.push(`/projects/${projectId}/entries/new`);
  };

  const handleCopyLast = () => {
    router.push(`/projects/${projectId}/entries/new?copyLast=true`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Entry</h2>
          <p className="text-gray-600 mt-2">
            Choose how you want to start your new entry
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStartFresh}
            className="w-full px-6 py-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-semibold text-left flex items-start space-x-3"
          >
            <span className="text-2xl">📝</span>
            <div>
              <div className="font-semibold">Start Fresh</div>
              <div className="text-sm text-accent-100 mt-1">
                Create a new entry with empty fields
              </div>
            </div>
          </button>

          <button
            onClick={handleCopyLast}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-left flex items-start space-x-3"
          >
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-semibold">Copy Last Entry</div>
              <div className="text-sm text-blue-100 mt-1">
                Start with decks, category, and series from your most recent entry
              </div>
            </div>
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

