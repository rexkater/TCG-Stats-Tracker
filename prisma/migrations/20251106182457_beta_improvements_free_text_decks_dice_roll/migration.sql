/*
  Warnings:

  - You are about to drop the column `contextOptionId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `myBattlefieldId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `myDeckId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oppBattlefieldId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oppDeckId` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `myDeckName` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oppDeckName` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add new columns as nullable first
ALTER TABLE "Entry" ADD COLUMN "myDeckName" TEXT;
ALTER TABLE "Entry" ADD COLUMN "oppDeckName" TEXT;
ALTER TABLE "Entry" ADD COLUMN "wonDiceRoll" BOOLEAN;

-- Step 2: Migrate data from foreign keys to text fields
UPDATE "Entry" e
SET "myDeckName" = d.name
FROM "Deck" d
WHERE e."myDeckId" = d.id;

UPDATE "Entry" e
SET "oppDeckName" = d.name
FROM "Deck" d
WHERE e."oppDeckId" = d.id;

-- Step 3: Make the new columns NOT NULL (now that they have data)
ALTER TABLE "Entry" ALTER COLUMN "myDeckName" SET NOT NULL;
ALTER TABLE "Entry" ALTER COLUMN "oppDeckName" SET NOT NULL;

-- Step 4: Drop foreign key constraints
ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_contextOptionId_fkey";
ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_myBattlefieldId_fkey";
ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_myDeckId_fkey";
ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_oppBattlefieldId_fkey";
ALTER TABLE "Entry" DROP CONSTRAINT IF EXISTS "Entry_oppDeckId_fkey";

-- Step 5: Drop old indexes
DROP INDEX IF EXISTS "Entry_projectId_myBattlefieldId_idx";
DROP INDEX IF EXISTS "Entry_projectId_myDeckId_oppDeckId_idx";
DROP INDEX IF EXISTS "Entry_projectId_oppBattlefieldId_idx";

-- Step 6: Drop old columns
ALTER TABLE "Entry" DROP COLUMN IF EXISTS "contextOptionId";
ALTER TABLE "Entry" DROP COLUMN IF EXISTS "myBattlefieldId";
ALTER TABLE "Entry" DROP COLUMN IF EXISTS "myDeckId";
ALTER TABLE "Entry" DROP COLUMN IF EXISTS "oppBattlefieldId";
ALTER TABLE "Entry" DROP COLUMN IF EXISTS "oppDeckId";

-- CreateIndex
CREATE INDEX "Entry_projectId_myDeckName_oppDeckName_idx" ON "Entry"("projectId", "myDeckName", "oppDeckName");
