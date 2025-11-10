/**
 * Get the image path for a deck/legend
 * @param deckName - The name of the deck/legend
 * @returns The path to the deck image
 */
export function getDeckImagePath(deckName: string): string {
  // Convert deck name to filename format (lowercase, no apostrophes, spaces to hyphens)
  const fileName = deckName.toLowerCase().replace(/'/g, '').replace(/ /g, '-');
  return `/decks/${fileName}.webp`;
}

/**
 * Riftbound legend names (for reference)
 */
export const RIFTBOUND_LEGENDS = [
  "Ahri",
  "Annie",
  "Darius",
  "Garen",
  "Jinx",
  "Kai'Sa",
  "Lee Sin",
  "Leona",
  "Lux",
  "Master Yi",
  "Miss Fortune",
  "Sett",
  "Teemo",
  "Viktor",
  "Volibear",
  "Yasuo",
] as const;

