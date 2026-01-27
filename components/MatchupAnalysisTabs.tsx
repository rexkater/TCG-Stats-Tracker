'use client';

import { useState } from 'react';
import { formatWinRate, formatRecord, type MatchupStats } from '@/lib/analytics';

type MatchupAnalysisTabsProps = {
  matchups: MatchupStats[];
};

export default function MatchupAnalysisTabs({ matchups }: MatchupAnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'first' | 'second'>('all');

  // Calculate stats for each initiative
  const calculateInitiativeStats = (matchup: MatchupStats, initiative: 'FIRST' | 'SECOND') => {
    const filteredEntries = matchup.entries.filter(e => e.initiative === initiative);
    
    const wins = filteredEntries.filter(e => e.result === 'WIN').length;
    const losses = filteredEntries.filter(e => e.result === 'LOSS').length;
    const draws = filteredEntries.filter(e => e.result === 'DRAW').length;
    const total = filteredEntries.length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return { wins, losses, draws, total, winRate };
  };

  // Get matchups for current tab
  const getMatchupsForTab = () => {
    if (activeTab === 'all') {
      return matchups;
    }

    const initiative = activeTab === 'first' ? 'FIRST' : 'SECOND';
    
    return matchups
      .map(matchup => {
        const stats = calculateInitiativeStats(matchup, initiative);
        return {
          ...matchup,
          ...stats,
        };
      })
      .filter(m => m.total > 0) // Only show matchups with games in this initiative
      .sort((a, b) => b.total - a.total); // Sort by total games
  };

  const displayMatchups = getMatchupsForTab();

  return (
    <div className="bg-background-200 rounded-lg border border-background-400">
      {/* Header with Tabs */}
      <div className="border-b border-background-400">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">Matchup Analysis</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveTab('first')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'first'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
              }`}
            >
              Going First
            </button>
            <button
              onClick={() => setActiveTab('second')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'second'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
              }`}
            >
              Going Second
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
        <table className="min-w-full divide-y divide-background-400">
          <thead className="bg-background-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                My Deck
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                vs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Opponent Deck
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
            {displayMatchups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-primary-600">
                  No matchup data available
                  {activeTab !== 'all' && ` for ${activeTab === 'first' ? 'going first' : 'going second'}`}
                </td>
              </tr>
            ) : (
              displayMatchups.map((matchup, idx) => (
                <tr key={`${matchup.myDeckName}-${matchup.oppDeckName}-${idx}`} className="hover:bg-background-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                    {matchup.myDeckName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    vs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                    {matchup.oppDeckName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                    {matchup.wins}-{matchup.losses}-{matchup.draws}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      matchup.winRate >= 60 ? 'bg-green-100 text-green-800' :
                      matchup.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatWinRate(matchup.winRate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {matchup.total}
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

