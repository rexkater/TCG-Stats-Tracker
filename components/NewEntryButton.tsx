'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewEntryModal from './NewEntryModal';

interface NewEntryButtonProps {
  projectId: string;
  hasEntries: boolean;
}

export default function NewEntryButton({ projectId, hasEntries }: NewEntryButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (hasEntries) {
      setShowModal(true);
    } else {
      // No entries, go directly to new entry page
      router.push(`/projects/${projectId}/entries/new`);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2.5 bg-accent-300 text-white rounded-lg hover:bg-accent-400 transition-colors font-medium text-center touch-manipulation min-h-[44px] flex items-center justify-center sm:col-span-2 lg:col-span-1"
      >
        + New Entry
      </button>

      {showModal && (
        <NewEntryModal
          projectId={projectId}
          hasEntries={hasEntries}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

