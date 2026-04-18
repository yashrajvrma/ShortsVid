"use server";

import { prisma } from "@/db";
import { getSignedObjectUrl } from "@/lib/r2-bucket";
import { redirect } from "next/navigation";

export async function getConversationVideoDetailById({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}) {
  const conversationVideo = await prisma.conversationVideo.findUnique({
    where: { userId, id: videoId },
    include: {
      script: true,
      voice1: true,
      voice2: true,
      captionConfig: true,
      backgroundMusic: true,
      backgroundVideo: true,
      speaker1Avatar: true,
      speaker2Avatar: true,
    },
  });

  if (!conversationVideo || conversationVideo.status === "GENERATING") {
    redirect("/app/library");
  }

  // ── Generate signed URLs for all R2 assets

  const [speaker1AvatarUrl, speaker2AvatarUrl] = await Promise.all([
    getSignedObjectUrl(conversationVideo.speaker1Avatar.r2ObjectKey!),
    getSignedObjectUrl(conversationVideo.speaker2Avatar.r2ObjectKey!),
  ]);

  // Audio
  const audioUrl = conversationVideo.audio
    ? await getSignedObjectUrl(conversationVideo.audio)
    : null;

  // Thumbnail
  const thumbnailUrl = conversationVideo.thumbnailR2ObjectKey
    ? await getSignedObjectUrl(conversationVideo.thumbnailR2ObjectKey)
    : null;

  // Final rendered video (only exists on SUCCESS)
  const videoUrl =
    conversationVideo.status === "SUCCESS" && conversationVideo.r2ObjectKey
      ? await getSignedObjectUrl(conversationVideo.r2ObjectKey)
      : null;

  // Background music
  const backgroundMusicUrl = conversationVideo.backgroundMusic?.r2ObjectKey
    ? await getSignedObjectUrl(conversationVideo.backgroundMusic.r2ObjectKey)
    : null;

  // Background video
  const backgroundVideoUrl = conversationVideo.backgroundVideo.r2ObjectKey
    ? await getSignedObjectUrl(conversationVideo.backgroundVideo.r2ObjectKey)
    : null;

  return {
    id: conversationVideo.id,
    type: "conversation-video",
    status: conversationVideo.status,
    duration: conversationVideo.duration,
    script: {
      id: conversationVideo.script.id,
      languageCode: conversationVideo.script.languageCode,
      topic: conversationVideo.script.topic,
      prompt: conversationVideo.script.prompt,
      content: conversationVideo.script.content,
    },
    // Signed asset URLs — ready for Remotion
    captionConfig: conversationVideo.captionConfig,
    caption: conversationVideo.caption,
    speaker1AvatarUrl,
    speaker2AvatarUrl,
    audioUrl,
    videoUrl,
    backgroundVideoUrl,
    backgroundMusicUrl,
    createdAt: conversationVideo.createdAt,
    updatedAt: conversationVideo.updatedAt,
  };
}
