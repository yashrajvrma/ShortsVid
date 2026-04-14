/*
  Warnings:

  - The values [VIDEO,IMAGE] on the enum `StockType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StockType_new" AS ENUM ('VOICE', 'BG_VIDEO', 'BG_MUSIC', 'MUSIC', 'AI_AVATAR');
ALTER TABLE "stock" ALTER COLUMN "stockType" TYPE "StockType_new" USING ("stockType"::text::"StockType_new");
ALTER TYPE "StockType" RENAME TO "StockType_old";
ALTER TYPE "StockType_new" RENAME TO "StockType";
DROP TYPE "public"."StockType_old";
COMMIT;
