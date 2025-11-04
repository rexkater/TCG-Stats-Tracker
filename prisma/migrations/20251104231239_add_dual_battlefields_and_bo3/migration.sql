-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "myDeckId" TEXT NOT NULL,
    "oppDeckId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "myBattlefieldId" TEXT,
    "oppBattlefieldId" TEXT,
    "contextOptionId" TEXT,
    "result" TEXT NOT NULL,
    "initiative" TEXT NOT NULL,
    "notesShort" TEXT,
    "myScore" REAL,
    "oppScore" REAL,
    "gameNumber" INTEGER,
    "seriesId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Entry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entry_myDeckId_fkey" FOREIGN KEY ("myDeckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_oppDeckId_fkey" FOREIGN KEY ("oppDeckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_myBattlefieldId_fkey" FOREIGN KEY ("myBattlefieldId") REFERENCES "ContextOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_oppBattlefieldId_fkey" FOREIGN KEY ("oppBattlefieldId") REFERENCES "ContextOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_contextOptionId_fkey" FOREIGN KEY ("contextOptionId") REFERENCES "ContextOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("categoryId", "contextOptionId", "createdAt", "id", "initiative", "myDeckId", "myScore", "notesShort", "oppDeckId", "oppScore", "projectId", "result", "updatedAt") SELECT "categoryId", "contextOptionId", "createdAt", "id", "initiative", "myDeckId", "myScore", "notesShort", "oppDeckId", "oppScore", "projectId", "result", "updatedAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE INDEX "Entry_projectId_myDeckId_oppDeckId_idx" ON "Entry"("projectId", "myDeckId", "oppDeckId");
CREATE INDEX "Entry_projectId_initiative_idx" ON "Entry"("projectId", "initiative");
CREATE INDEX "Entry_projectId_myBattlefieldId_idx" ON "Entry"("projectId", "myBattlefieldId");
CREATE INDEX "Entry_projectId_oppBattlefieldId_idx" ON "Entry"("projectId", "oppBattlefieldId");
CREATE INDEX "Entry_projectId_seriesId_idx" ON "Entry"("projectId", "seriesId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
