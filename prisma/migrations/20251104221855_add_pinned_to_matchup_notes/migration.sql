-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchupNotesLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "deckAId" TEXT NOT NULL,
    "deckBId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatchupNotesLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_deckAId_fkey" FOREIGN KEY ("deckAId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_deckBId_fkey" FOREIGN KEY ("deckBId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchupNotesLog" ("authorUserId", "contentMarkdown", "createdAt", "deckAId", "deckBId", "id", "projectId", "tcgId", "updatedAt") SELECT "authorUserId", "contentMarkdown", "createdAt", "deckAId", "deckBId", "id", "projectId", "tcgId", "updatedAt" FROM "MatchupNotesLog";
DROP TABLE "MatchupNotesLog";
ALTER TABLE "new_MatchupNotesLog" RENAME TO "MatchupNotesLog";
CREATE INDEX "MatchupNotesLog_projectId_deckAId_deckBId_idx" ON "MatchupNotesLog"("projectId", "deckAId", "deckBId");
CREATE INDEX "MatchupNotesLog_projectId_pinned_idx" ON "MatchupNotesLog"("projectId", "pinned");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
