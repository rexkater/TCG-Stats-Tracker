'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDeckImagePath } from '@/lib/deck-images';
import { formatWinRate } from '@/lib/analytics';
import type { GlobalAnalytics } from '@/lib/global-analytics';

type TCG = {
  id: string;
  name: string;
};

type GlobalAnalyticsDashboardProps = {
  tcgs: TCG[];
};

export default function GlobalAnalyticsDashboard({ tcgs }: GlobalAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState(tcgs[0]?.id || '');
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch analytics when tab changes
  useEffect(() => {
    if (!activeTab) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/analytics/global?tcgId=${activeTab}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics. Please try again.');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeTab]);

  const activeTCG = tcgs.find((tcg) => tcg.id === activeTab);

  return (
    <div>
      {/* TCG Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tcgs.map((tcg) => (
              <button
                key={tcg.id}
                onClick={() => setActiveTab(tcg.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tcg.id
                    ? 'border-accent-600 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tcg.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Analytics Content */}
      {!loading && !error && analytics && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Games</div>
              <div className="text-3xl font-bold text-primary-700">{analytics.totalGames.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Projects</div>
              <div className="text-3xl font-bold text-primary-700">{analytics.totalProjects.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Active Users</div>
              <div className="text-3xl font-bold text-primary-700">{analytics.totalUsers.toLocaleString()}</div>
            </div>
          </div>

          {/* Most Played Decks */}
          {analytics.mostPlayedDecks.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">📈 Most Played Decks</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {analytics.mostPlayedDecks.slice(0, 10).map((deck, index) => (
                  <div key={deck.deckName} className="text-center">
                    {activeTCG?.name === 'Riftbound' && (
                      <Image
                        src={getDeckImagePath(deck.deckName)}
                        alt={deck.deckName}
                        width={80}
                        height={112}
                        className="rounded-lg shadow-md mx-auto mb-2"
                        unoptimized
                      />
                    )}
                    <div className="font-semibold text-sm text-gray-900">{deck.deckName}</div>
                    <div className="text-xs text-gray-600">{deck.count.toLocaleString()} games</div>
                    {index === 0 && <div className="text-xs text-accent-600 font-semibold mt-1">🏆 Most Popular</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deck Performance */}
          {analytics.deckStats.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">🎯 Deck Performance</h2>
              <p className="text-sm text-gray-600 mb-4">Minimum {10} games required</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deck
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.deckStats.map((deck) => (
                      <tr key={deck.deckName} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            {activeTCG?.name === 'Riftbound' && (
                              <Image
                                src={getDeckImagePath(deck.deckName)}
                                alt={deck.deckName}
                                width={40}
                                height={56}
                                className="rounded shadow-sm"
                                unoptimized
                              />
                            )}
                            {deck.deckName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatWinRate(deck.winRate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {deck.wins}W - {deck.losses}L{deck.draws > 0 ? ` - ${deck.draws}D` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {deck.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matchup Analysis */}
          {analytics.matchupStats.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">⚔️ Matchup Analysis</h2>
              <p className="text-sm text-gray-600 mb-4">Top matchups by games played (minimum {10} games)</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        My Deck
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        vs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opponent Deck
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.matchupStats.slice(0, 20).map((matchup, index) => (
                      <tr key={`${matchup.myDeck}-${matchup.oppDeck}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {matchup.myDeck}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          vs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {matchup.oppDeck}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatWinRate(matchup.winRate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {matchup.wins}W - {matchup.losses}L{matchup.draws > 0 ? ` - ${matchup.draws}D` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {matchup.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Battlefield Performance */}
          {analytics.battlefieldStats.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">🗺️ Battlefield Performance</h2>
              <p className="text-sm text-gray-600 mb-4">Minimum {10} games required</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Battlefield
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.battlefieldStats.map((battlefield) => (
                      <tr key={battlefield.battlefieldName} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {battlefield.battlefieldName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatWinRate(battlefield.winRate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {battlefield.wins}W - {battlefield.losses}L{battlefield.draws > 0 ? ` - ${battlefield.draws}D` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {battlefield.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Performance */}
          {analytics.categoryStats.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">📂 Category Performance</h2>
              <p className="text-sm text-gray-600 mb-4">Minimum {10} games required</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.categoryStats.map((category) => (
                      <tr key={category.categoryName} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatWinRate(category.winRate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {category.wins}W - {category.losses}L{category.draws > 0 ? ` - ${category.draws}D` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {category.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {analytics.totalGames === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No data available for {activeTCG?.name} yet.</p>
              <p className="text-sm text-gray-500 mt-2">Start tracking games to see analytics!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

