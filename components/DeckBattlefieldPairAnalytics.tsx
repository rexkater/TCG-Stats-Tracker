'use client';

import { formatWinRate, formatRecord, type DeckBattlefieldPairStats } from '@/lib/analytics';

type DeckBattlefieldPairAnalyticsProps = {
  contextLabel: string;
  byDeckBattlefieldPair: DeckBattlefieldPairStats[];
};

export default function DeckBattlefieldPairAnalytics({
  contextLabel,
  byDeckBattlefieldPair,
}: DeckBattlefieldPairAnalyticsProps) {
  if (byDeckBattlefieldPair.length === 0) {
    return null;
  }

  return (
    <div className="bg-background-200 rounded-lg border border-background-400">
      {/* Header */}
      <div className="px-6 py-4 border-b border-background-400">
        <h2 className="text-xl font-semibold text-primary-900">
          Matchup {contextLabel} Pairs
        </h2>
        <p className="text-sm text-primary-700 mt-1">
          Win rate vs opponent decks with specific {contextLabel.toLowerCase()} combinations
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="min-w-full divide-y divide-background-400">
          <thead className="bg-background-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                My Deck
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Opponent Deck
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                My {contextLabel}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Opp {contextLabel}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Record
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Win Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                Games
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-200 divide-y divide-background-400">
            {byDeckBattlefieldPair.map((matchup, idx) => (
              <tr key={`${matchup.myDeckName}-${matchup.oppDeckName}-${matchup.myContextId}-${matchup.oppContextId}-${idx}`} className="hover:bg-background-100">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                  {matchup.myDeckName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                  {matchup.oppDeckName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                  {matchup.myContextName || 'None'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                  {matchup.oppContextName || 'None'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                  {formatRecord(matchup)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    matchup.winRate >= 60 ? 'bg-green-100 text-green-800' :
                    matchup.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {formatWinRate(matchup.winRate)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600">
                  {matchup.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

