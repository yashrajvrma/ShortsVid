/*
  Warnings:

  - A unique constraint covering the columns `[polarOrderId]` on the table `credit_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CreditHistoryType" AS ENUM ('SUBSCRIPTION_CREDIT', 'ONE_TIME_CREDIT', 'DEDUCTION', 'REFUND', 'MANUAL_GRANT');

-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "credit_history" ADD COLUMN     "polarOrderId" TEXT,
ADD COLUMN     "type" "CreditHistoryType" NOT NULL DEFAULT 'DEDUCTION',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "amount" INTEGER,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "polarPriceId" TEXT,
ADD COLUMN     "polarProductId" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "credit_history_polarOrderId_key" ON "credit_history"("polarOrderId");
