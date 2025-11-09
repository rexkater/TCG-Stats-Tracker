"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Deck, Category, ContextOption } from '@prisma/client';
import { getDeckImagePath } from '@/lib/deck-images';

interface EntryFormProps {
  projectId: string;
  decks: Deck[];
  categories: Category[];
  contextOptions: ContextOption[];
  contextLabel?: string;
  mode: 'create' | 'edit';
  entryId?: string;
  defaultValues?: {
    myDeckName: string;
    oppDeckName: string;
    categoryId: string;
    myBattlefieldId: string | null;
    oppBattlefieldId: string | null;
    result: string;
    initiative: string;
    wonDiceRoll: boolean | null;
    notesShort: string | null;
    gameNumber: number | null;
    seriesId: string | null;
  };
}

export default function EntryForm({
  projectId,
  decks,
  categories,
  contextOptions,
  contextLabel,
  mode,
  entryId,
  defaultValues,
}: EntryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameNumber, setGameNumber] = useState<string>(defaultValues?.gameNumber?.toString() || '');
  const [myDeckName, setMyDeckName] = useState<string>(defaultValues?.myDeckName || '');
  const [oppDeckName, setOppDeckName] = useState<string>(defaultValues?.oppDeckName || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      projectId,
      myDeckName: formData.get('myDeckName') as string,
      oppDeckName: formData.get('oppDeckName') as string,
      categoryId: formData.get('categoryId') as string,
      myBattlefieldId: formData.get('myBattlefieldId') as string || null,
      oppBattlefieldId: formData.get('oppBattlefieldId') as string || null,
      result: formData.get('result') as string,
      initiative: formData.get('initiative') as string,
      wonDiceRoll: formData.get('wonDiceRoll') === 'on',
      notesShort: formData.get('notesShort') as string || null,
      gameNumber: formData.get('gameNumber') ? Number(formData.get('gameNumber')) : null,
      seriesId: formData.get('seriesId') as string || null,
    };

    try {
      if (mode === 'create') {
        const response = await fetch(`/api/projects/${projectId}/entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create entry');
        }
      } else {
        const response = await fetch(`/api/entries/${entryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update entry');
        }
      }

      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('Failed to save entry. Please try again.');
      setIsSubmitting(false);
    }
  };

  const showDiceRoll = gameNumber === '1';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            My Deck <span className="text-red-500">*</span>
          </label>
          {/* Deck image preview */}
          {decks.length > 0 && myDeckName && (
            <div className="mb-3 flex justify-center">
              <Image
                src={getDeckImagePath(myDeckName)}
                alt={myDeckName}
                width={100}
                height={140}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          {decks.length > 0 ? (
            <select
              name="myDeckName"
              required
              value={myDeckName}
              onChange={(e) => setMyDeckName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a deck...</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.name}>
                  {deck.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="myDeckName"
              required
              defaultValue={defaultValues?.myDeckName || ''}
              placeholder="e.g., Control Deck, Aggro Build"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opponent Deck <span className="text-red-500">*</span>
          </label>
          {/* Deck image preview */}
          {decks.length > 0 && oppDeckName && (
            <div className="mb-3 flex justify-center">
              <Image
                src={getDeckImagePath(oppDeckName)}
                alt={oppDeckName}
                width={100}
                height={140}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          {decks.length > 0 ? (
            <select
              name="oppDeckName"
              required
              value={oppDeckName}
              onChange={(e) => setOppDeckName(e.target.value)}
              defaultValue={defaultValues?.oppDeckName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a deck...</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.name}>
                  {deck.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="oppDeckName"
              required
              defaultValue={defaultValues?.oppDeckName || ''}
              placeholder="e.g., Midrange Deck, Combo Build"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      </div>

      {/* Battlefields (Context Options) */}
      {contextLabel && contextOptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My {contextLabel}
            </label>
            <select
              name="myBattlefieldId"
              defaultValue={defaultValues?.myBattlefieldId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None</option>
              {contextOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opponent {contextLabel}
            </label>
            <select
              name="oppBattlefieldId"
              defaultValue={defaultValues?.oppBattlefieldId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None</option>
              {contextOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="categoryId"
          required
          defaultValue={defaultValues?.categoryId || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Result and Initiative */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result <span className="text-red-500">*</span>
          </label>
          <select
            name="result"
            required
            defaultValue={defaultValues?.result || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select...</option>
            <option value="WIN">Win</option>
            <option value="LOSS">Loss</option>
            <option value="DRAW">Draw</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initiative <span className="text-red-500">*</span>
          </label>
          <select
            name="initiative"
            required
            defaultValue={defaultValues?.initiative || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select...</option>
            <option value="FIRST">First</option>
            <option value="SECOND">Second</option>
          </select>
        </div>

        {showDiceRoll && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dice Roll
            </label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                name="wonDiceRoll"
                defaultChecked={defaultValues?.wonDiceRoll || false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Won pre-game dice roll
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Best-of-3 Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Number
          </label>
          <input
            type="number"
            name="gameNumber"
            min="1"
            max="3"
            value={gameNumber}
            onChange={(e) => setGameNumber(e.target.value)}
            placeholder="1, 2, or 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">For best-of-3 matches (dice roll shown for game 1)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Series ID
          </label>
          <input
            type="text"
            name="seriesId"
            defaultValue={defaultValues?.seriesId || ''}
            placeholder="e.g., match-001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Groups games in the same match</p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notesShort"
          rows={3}
          defaultValue={defaultValues?.notesShort || ''}
          placeholder="Quick notes about the match..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save Entry' : 'Update Entry'}
        </button>
      </div>
    </form>
  );
}

