/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `battlefield` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `allowDraws` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tcg` on the `Project` table. All the data in the column will be lost.
  - Added the required column `initiative` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `Entry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tcgId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TCG" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "settingsJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContextOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tcgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContextOption_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchupNotesLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "deckAId" TEXT NOT NULL,
    "deckBId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatchupNotesLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_deckAId_fkey" FOREIGN KEY ("deckAId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_deckBId_fkey" FOREIGN KEY ("deckBId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchupNotesLog_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Category_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("id", "name", "projectId") SELECT "id", "name", "projectId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_projectId_idx" ON "Category"("projectId");
CREATE UNIQUE INDEX "Category_projectId_name_key" ON "Category"("projectId", "name");
CREATE TABLE "new_Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Deck_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Deck" ("createdAt", "id", "name", "projectId") SELECT "createdAt", "id", "name", "projectId" FROM "Deck";
DROP TABLE "Deck";
ALTER TABLE "new_Deck" RENAME TO "Deck";
CREATE INDEX "Deck_projectId_idx" ON "Deck"("projectId");
CREATE UNIQUE INDEX "Deck_projectId_name_key" ON "Deck"("projectId", "name");
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "myDeckId" TEXT NOT NULL,
    "oppDeckId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "contextOptionId" TEXT,
    "result" TEXT NOT NULL,
    "initiative" TEXT NOT NULL,
    "notesShort" TEXT,
    "myScore" REAL,
    "oppScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Entry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entry_myDeckId_fkey" FOREIGN KEY ("myDeckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_oppDeckId_fkey" FOREIGN KEY ("oppDeckId") REFERENCES "Deck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_contextOptionId_fkey" FOREIGN KEY ("contextOptionId") REFERENCES "ContextOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("categoryId", "createdAt", "id", "myDeckId", "myScore", "oppDeckId", "oppScore", "projectId", "result", "updatedAt") SELECT "categoryId", "createdAt", "id", "myDeckId", "myScore", "oppDeckId", "oppScore", "projectId", "result", "updatedAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE INDEX "Entry_projectId_myDeckId_oppDeckId_idx" ON "Entry"("projectId", "myDeckId", "oppDeckId");
CREATE INDEX "Entry_projectId_initiative_idx" ON "Entry"("projectId", "initiative");
CREATE INDEX "Entry_projectId_contextOptionId_idx" ON "Entry"("projectId", "contextOptionId");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "archivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE INDEX "Project_tcgId_idx" ON "Project"("tcgId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TCG_name_key" ON "TCG"("name");

-- CreateIndex
CREATE INDEX "ContextOption_tcgId_idx" ON "ContextOption"("tcgId");

-- CreateIndex
CREATE UNIQUE INDEX "ContextOption_tcgId_name_key" ON "ContextOption"("tcgId", "name");

-- CreateIndex
CREATE INDEX "MatchupNotesLog_projectId_deckAId_deckBId_idx" ON "MatchupNotesLog"("projectId", "deckAId", "deckBId");
