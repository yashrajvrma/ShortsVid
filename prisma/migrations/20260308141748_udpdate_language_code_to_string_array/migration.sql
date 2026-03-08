/*
  Warnings:

  - The `languageCode` column on the `voice` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "voice" DROP COLUMN "languageCode",
ADD COLUMN     "languageCode" TEXT[];
