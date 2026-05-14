/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `credit_history` table. All the data in the column will be lost.
  - Made the column `amount` on table `subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `polarPriceId` on table `subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `polarProductId` on table `subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startedAt` on table `subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "credit_history" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "subscription" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "polarPriceId" SET NOT NULL,
ALTER COLUMN "polarProductId" SET NOT NULL,
ALTER COLUMN "startedAt" SET NOT NULL;
