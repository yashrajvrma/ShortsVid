/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Script` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('MOTIVATIONAL', 'HORROR_STORY', 'HISTORY_FACTS', 'PHILOSOPHY', 'STORYTELLING', 'MYSTERY_STORY', 'LIFE_HACKS', 'ANY_TOPIC');

-- CreateEnum
CREATE TYPE "VideoStyle" AS ENUM ('REALISTIC', 'CLIPART', 'ANIME', 'CYBERPUNK', 'CINEMATIC', 'PIXEL_ART', 'COLORFUL_COMICS');

-- CreateEnum
CREATE TYPE "StockVariant" AS ENUM ('SYSTEM', 'USER');

-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('VOICE', 'VIDEO', 'IMAGE', 'MUSIC');

-- CreateEnum
CREATE TYPE "VoiceService" AS ENUM ('FISH_AUDIO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROCESSING', 'SUCCESS', 'FAILED');

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "Script";

-- DropEnum
DROP TYPE "Prompt";

-- DropEnum
DROP TYPE "STATUS";

-- DropEnum
DROP TYPE "VideoType";

-- CreateTable
CREATE TABLE "script" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "languageCode" TEXT NOT NULL DEFAULT 'en',
    "topic" "Topic" NOT NULL,
    "duration" INTEGER NOT NULL,
    "prompt" TEXT,
    "content" TEXT[],
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stockVariant" "StockVariant" NOT NULL,
    "stockType" "StockType" NOT NULL,
    "mimetype" TEXT,
    "duration" INTEGER,
    "r2ObjectKey" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "service" "VoiceService" NOT NULL,
    "voiceId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "r2ObjectKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoStyle" "VideoStyle" NOT NULL,
    "duration" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'PROCESSING',
    "scriptId" TEXT NOT NULL,
    "voiceId" TEXT,
    "captionConfigId" TEXT,
    "backgroundMusicId" TEXT,
    "images" TEXT[],
    "audio" TEXT,
    "caption" JSONB,
    "r2ObjectKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caption_config" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "fontType" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL,
    "textColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "strokeColor" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "highlightColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caption_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_scriptId_key" ON "video"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "video_captionConfigId_key" ON "video"("captionConfigId");

-- AddForeignKey
ALTER TABLE "script" ADD CONSTRAINT "script_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "voice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_captionConfigId_fkey" FOREIGN KEY ("captionConfigId") REFERENCES "caption_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_backgroundMusicId_fkey" FOREIGN KEY ("backgroundMusicId") REFERENCES "stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
