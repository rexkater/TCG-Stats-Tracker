-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'LOSS', 'DRAW');

-- CreateEnum
CREATE TYPE "Initiative" AS ENUM ('FIRST', 'SECOND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TCG" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "settingsJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TCG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextOption" (
    "id" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckImage" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeckImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "myDeckId" TEXT NOT NULL,
    "oppDeckId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "myBattlefieldId" TEXT,
    "oppBattlefieldId" TEXT,
    "contextOptionId" TEXT,
    "result" "MatchResult" NOT NULL,
    "initiative" "Initiative" NOT NULL,
    "notesShort" TEXT,
    "myScore" DOUBLE PRECISION,
    "oppScore" DOUBLE PRECISION,
    "gameNumber" INTEGER,
    "seriesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchupNotesLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tcgId" TEXT NOT NULL,
    "deckAId" TEXT NOT NULL,
    "deckBId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchupNotesLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TCG_name_key" ON "TCG"("name");

-- CreateIndex
CREATE INDEX "ContextOption_tcgId_idx" ON "ContextOption"("tcgId");

-- CreateIndex
CREATE UNIQUE INDEX "ContextOption_tcgId_name_key" ON "ContextOption"("tcgId", "name");

-- CreateIndex
CREATE INDEX "Project_tcgId_idx" ON "Project"("tcgId");

-- CreateIndex
CREATE INDEX "Category_projectId_idx" ON "Category"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_projectId_name_key" ON "Category"("projectId", "name");

-- CreateIndex
CREATE INDEX "Deck_projectId_idx" ON "Deck"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Deck_projectId_name_key" ON "Deck"("projectId", "name");

-- CreateIndex
CREATE INDEX "Entry_projectId_myDeckId_oppDeckId_idx" ON "Entry"("projectId", "myDeckId", "oppDeckId");

-- CreateIndex
CREATE INDEX "Entry_projectId_initiative_idx" ON "Entry"("projectId", "initiative");

-- CreateIndex
CREATE INDEX "Entry_projectId_myBattlefieldId_idx" ON "Entry"("projectId", "myBattlefieldId");

-- CreateIndex
CREATE INDEX "Entry_projectId_oppBattlefieldId_idx" ON "Entry"("projectId", "oppBattlefieldId");

-- CreateIndex
CREATE INDEX "Entry_projectId_seriesId_idx" ON "Entry"("projectId", "seriesId");

-- CreateIndex
CREATE INDEX "MatchupNotesLog_projectId_deckAId_deckBId_idx" ON "MatchupNotesLog"("projectId", "deckAId", "deckBId");

-- CreateIndex
CREATE INDEX "MatchupNotesLog_projectId_pinned_idx" ON "MatchupNotesLog"("projectId", "pinned");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "ContextOption" ADD CONSTRAINT "ContextOption_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckImage" ADD CONSTRAINT "DeckImage_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_myDeckId_fkey" FOREIGN KEY ("myDeckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_oppDeckId_fkey" FOREIGN KEY ("oppDeckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_myBattlefieldId_fkey" FOREIGN KEY ("myBattlefieldId") REFERENCES "ContextOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_oppBattlefieldId_fkey" FOREIGN KEY ("oppBattlefieldId") REFERENCES "ContextOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_contextOptionId_fkey" FOREIGN KEY ("contextOptionId") REFERENCES "ContextOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupNotesLog" ADD CONSTRAINT "MatchupNotesLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupNotesLog" ADD CONSTRAINT "MatchupNotesLog_tcgId_fkey" FOREIGN KEY ("tcgId") REFERENCES "TCG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupNotesLog" ADD CONSTRAINT "MatchupNotesLog_deckAId_fkey" FOREIGN KEY ("deckAId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupNotesLog" ADD CONSTRAINT "MatchupNotesLog_deckBId_fkey" FOREIGN KEY ("deckBId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchupNotesLog" ADD CONSTRAINT "MatchupNotesLog_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
