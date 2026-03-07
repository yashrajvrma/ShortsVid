-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('CONVERSATION', 'FACELESS', 'GAMEPLAY');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "Prompt" AS ENUM ('MOTIVATIONAL', 'HORROR_STORY', 'HISTORY_FACTS', 'PHILOSOPHY', 'STORY', 'MYSTERY', 'FUNNY', 'CHILDREN_STORY');

-- CreateTable
CREATE TABLE "Asset" (
    "id" VARCHAR(30) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_extension" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL DEFAULT 'en',
    "prompt" "Prompt" NOT NULL,
    "topic" TEXT,
    "duration" INTEGER NOT NULL,
    "content" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
