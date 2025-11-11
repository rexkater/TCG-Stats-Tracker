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
  const [activeTab, setActiveTab] = useState<'battlefield' | 'matchups' | 'category'>(
    hasContext ? 'battlefield' : 'category'
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {hasContext ? 'Context Performance' : 'Category Performance'}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {/* Only show context tabs if contextLabel exists */}
            {hasContext && (
              <>
                <button
                  onClick={() => setActiveTab('battlefield')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'battlefield'
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {contextLabel}
                </button>
                <button
                  onClick={() => setActiveTab('matchups')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'matchups'
                      ? 'bg-accent-100 text-accent-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {contextLabel} Matchups
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('category')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'category'
                  ? 'bg-accent-100 text-accent-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Category
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
        {activeTab === 'battlefield' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {contextLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Games
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {byContext.map((context) => (
                <tr key={context.contextOptionId || 'none'} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {context.contextOptionName || 'None'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {context.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'matchups' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  My {contextLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opponent {contextLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Games
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {byContextMatchup.map((matchup, idx) => (
                <tr key={`${matchup.myContextId}-${matchup.oppContextId}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {matchup.myContextName || 'None'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {matchup.oppContextName || 'None'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {matchup.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Games
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {byCategory.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.categoryName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
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

