-- CreateTable
CREATE TABLE "conversation_video" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'GENERATING',
    "scriptId" TEXT NOT NULL,
    "speaker1AvatarId" TEXT NOT NULL,
    "speaker2AvatarId" TEXT NOT NULL,
    "voice1Id" TEXT NOT NULL,
    "voice2Id" TEXT NOT NULL,
    "backgroundVideoId" TEXT NOT NULL,
    "backgroundMusicId" TEXT,
    "captionConfigId" TEXT,
    "audio" TEXT,
    "caption" JSONB,
    "thumbnailR2ObjectKey" TEXT,
    "r2ObjectKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversation_video_scriptId_key" ON "conversation_video"("scriptId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_video_captionConfigId_key" ON "conversation_video"("captionConfigId");

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_speaker1AvatarId_fkey" FOREIGN KEY ("speaker1AvatarId") REFERENCES "stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_speaker2AvatarId_fkey" FOREIGN KEY ("speaker2AvatarId") REFERENCES "stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_voice1Id_fkey" FOREIGN KEY ("voice1Id") REFERENCES "voice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_voice2Id_fkey" FOREIGN KEY ("voice2Id") REFERENCES "voice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_backgroundVideoId_fkey" FOREIGN KEY ("backgroundVideoId") REFERENCES "stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_backgroundMusicId_fkey" FOREIGN KEY ("backgroundMusicId") REFERENCES "stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_video" ADD CONSTRAINT "conversation_video_captionConfigId_fkey" FOREIGN KEY ("captionConfigId") REFERENCES "caption_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;
