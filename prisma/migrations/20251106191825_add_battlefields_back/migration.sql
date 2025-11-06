-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "myBattlefieldId" TEXT,
ADD COLUMN     "oppBattlefieldId" TEXT;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_myBattlefieldId_fkey" FOREIGN KEY ("myBattlefieldId") REFERENCES "ContextOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_oppBattlefieldId_fkey" FOREIGN KEY ("oppBattlefieldId") REFERENCES "ContextOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
