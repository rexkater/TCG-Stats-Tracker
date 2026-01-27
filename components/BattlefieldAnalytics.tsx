'use client';

import { useState } from 'react';
import { formatWinRate, formatRecord, type ContextStats, type ContextMatchupStats, type CategoryStats } from '@/lib/analytics';

type BattlefieldAnalyticsProps = {
  contextLabel: string | null;
  byContext: ContextStats[];
  byContextMatchup: ContextMatchupStats[];
  byCategory: CategoryStats[];
};

export default function BattlefieldAnalytics({
  contextLabel,
  byContext,
  byContextMatchup,
  byCategory,
}: BattlefieldAnalyticsProps) {
  // If no contextLabel (One Piece, Other TCGs), only show category tab
  const hasContext = contextLabel !== null;
  // Default to 'category' tab for all TCGs (Category first)
  const [activeTab, setActiveTab] = useState<'battlefield' | 'matchups' | 'category'>('category');

  return (
    <div className="bg-background-200 rounded-lg border border-background-400">
      {/* Header with Tabs */}
      <div className="border-b border-background-400">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-primary-900 mb-3">
            {hasContext ? 'Context Performance' : 'Category Performance'}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {/* Category tab first */}
            <button
              onClick={() => setActiveTab('category')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'category'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
              }`}
            >
              Category
            </button>
            {/* Only show context tabs if contextLabel exists */}
            {hasContext && (
              <>
                <button
                  onClick={() => setActiveTab('battlefield')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'battlefield'
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
                  }`}
                >
                  {contextLabel}
                </button>
                <button
                  onClick={() => setActiveTab('matchups')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'matchups'
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-primary-700 hover:text-primary-900 hover:bg-background-200'
                  }`}
                >
                  {contextLabel} Matchups
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
        {activeTab === 'battlefield' ? (
          <table className="min-w-full divide-y divide-background-400">
            <thead className="bg-background-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Deck
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  {contextLabel}
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
              {byContext.map((context, idx) => (
                <tr key={`${context.deckName}-${context.contextOptionId || 'none'}-${idx}`} className="hover:bg-background-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                    {context.deckName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                    {context.contextOptionName || 'None'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                    {formatRecord(context)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      context.winRate >= 60 ? 'bg-green-100 text-green-800' :
                      context.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatWinRate(context.winRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600">
                    {context.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'matchups' ? (
          <table className="min-w-full divide-y divide-background-400">
            <thead className="bg-background-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Deck
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  My {contextLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Opponent {contextLabel}
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
              {byContextMatchup.map((matchup, idx) => (
                <tr key={`${matchup.deckName}-${matchup.myContextId}-${matchup.oppContextId}-${idx}`} className="hover:bg-background-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                    {matchup.deckName}
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
        ) : (
          <table className="min-w-full divide-y divide-background-400">
            <thead className="bg-background-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Deck
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                  Category
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
              {byCategory.map((category, idx) => (
                <tr key={`${category.deckName}-${category.categoryId}-${idx}`} className="hover:bg-background-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                    {category.deckName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                    {category.categoryName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                    {formatRecord(category)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.winRate >= 60 ? 'bg-green-100 text-green-800' :
                      category.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatWinRate(category.winRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600">
                    {category.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

