/*
  Warnings:

  - You are about to drop the column `myScore` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oppScore` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "myScore",
DROP COLUMN "oppScore";
