'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getDeckImagePath } from '@/lib/deck-images';
import { formatWinRate } from '@/lib/analytics';

type DeckStats = {
  deckName: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
};

type DeckPerformanceTabsProps = {
  deckStatsByTCG: Map<string, DeckStats[]>;
};

export default function DeckPerformanceTabs({ deckStatsByTCG }: DeckPerformanceTabsProps) {
  // Convert Map to array and sort by preferred order: Riftbound, One Piece, Other
  const tcgOrder = ['Riftbound', 'One Piece', 'Other'];
  const tcgEntries = Array.from(deckStatsByTCG.entries()).sort((a, b) => {
    const indexA = tcgOrder.indexOf(a[0]);
    const indexB = tcgOrder.indexOf(b[0]);
    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only A is in the list, it comes first
    if (indexA !== -1) return -1;
    // If only B is in the list, it comes first
    if (indexB !== -1) return 1;
    // Otherwise, sort alphabetically
    return a[0].localeCompare(b[0]);
  });

  // Set default tab to "Riftbound" if it exists, otherwise first TCG
  const defaultTab = tcgEntries.find(([tcgName]) => tcgName === 'Riftbound')?.[0] || tcgEntries[0]?.[0] || '';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  if (tcgEntries.length === 0) {
    return null;
  }

  const activeDeckStats = deckStatsByTCG.get(activeTab) || [];

  return (
    <div className="bg-background-200 rounded-lg border border-primary-200">
      {/* Header with Tabs */}
      <div className="border-b border-primary-200">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-primary-700 mb-3">Deck Performance (All Projects)</h2>
          <div className="flex gap-2 flex-wrap">
            {tcgEntries.map(([tcgName]) => (
              <button
                key={tcgName}
                onClick={() => setActiveTab(tcgName)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tcgName
                    ? 'bg-accent-100 text-accent-700'
                    : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
                }`}
              >
                {tcgName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="min-w-full divide-y divide-background-400">
          <thead className="bg-background-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Deck
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Win Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Games
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-200 divide-y divide-background-400">
            {activeDeckStats.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-primary-600">
                  No deck data available for {activeTab}
                </td>
              </tr>
            ) : (
              activeDeckStats.map((deck) => (
                <tr key={deck.deckName} className="hover:bg-background-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                    <div className="flex items-center gap-3">
                      {/* Only show images for Riftbound TCG */}
                      {activeTab === 'Riftbound' && (
                        <Image
                          src={getDeckImagePath(deck.deckName)}
                          alt={deck.deckName}
                          width={40}
                          height={56}
                          className="rounded shadow-sm"
                          unoptimized
                        />
                      )}
                      <span>{deck.deckName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                    {deck.wins}-{deck.losses}-{deck.draws}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deck.winRate >= 60 ? 'bg-green-100 text-green-800' :
                      deck.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatWinRate(deck.winRate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {deck.total}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

