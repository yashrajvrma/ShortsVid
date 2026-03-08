/*
  Warnings:

  - Added the required column `voiceVariant` to the `voice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoiceVariant" AS ENUM ('SYSTEM', 'USER');

-- AlterTable
ALTER TABLE "voice" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "voiceVariant" "VoiceVariant" NOT NULL;
