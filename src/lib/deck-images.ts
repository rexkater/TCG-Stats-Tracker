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
  "Azir",
  "Darius",
  "Draven",
  "Ezreal",
  "Fiora",
  "Garen",
  "Irelia",
  "Jax",
  "Jinx",
  "Kai'Sa",
  "Lee Sin",
  "Leona",
  "Lucian",
  "Lux",
  "Master Yi",
  "Miss Fortune",
  "Ornn",
  "Rek'sai",
  "Renata",
  "Rumble",
  "Sett",
  "Sivir",
  "Teemo",
  "Viktor",
  "Volibear",
  "Yasuo",
] as const;

