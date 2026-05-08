"use server";

import { prisma } from "@/db";
import { getSignedObjectUrl } from "@/lib/r2-bucket";
import { redirect } from "next/navigation";

export async function getVideoDetailById({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}) {
  const video = await prisma.video.findUnique({
    where: { userId, id: videoId },
    include: {
      script: true,
      captionConfig: true,
      stock: true,
      voice: true,
    },
  });

  if (!video || video.status === "GENERATING") {
    redirect("/app/library?videoType=faceless-shorts");
  }

  // ── Generate signed URLs for all R2 assets

  // Images — array of r2 object keys
  const imagesUrl = video.images.length
    ? await Promise.all(video.images.map((key) => getSignedObjectUrl(key)))
    : [];

  // Audio
  const audioUrl = video.audio ? await getSignedObjectUrl(video.audio) : null;

  // Thumbnail
  const thumbnailUrl = video.thumbnailR2ObjectKey
    ? await getSignedObjectUrl(video.thumbnailR2ObjectKey)
    : null;

  // Final rendered video (only exists on SUCCESS)
  const videoUrl =
    video.status === "SUCCESS" && video.r2ObjectKey
      ? await getSignedObjectUrl(video.r2ObjectKey)
      : null;

  // Background music
  const backgroundMusicUrl = video.stock?.r2ObjectKey
    ? await getSignedObjectUrl(video.stock.r2ObjectKey)
    : null;

  return {
    id: video.id,
    type: "faceless-shorts",
    status: video.status,
    videoStyle: video.videoStyle,
    duration: video.duration,
    script: {
      id: video.script.id,
      languageCode: video.script.languageCode,
      topic: video.script.topic,
      prompt: video.script.prompt,
      content: video.script.content,
    },
    voice: video.voice
      ? {
          id: video.voice.id,
          name: video.voice.name,
          gender: video.voice.gender,
          languageCode: video.voice.languageCode,
        }
      : null,
    // Signed asset URLs — ready for Remotion
    captionConfig: video.captionConfig,
    caption: video.caption,
    imagesUrl,
    audioUrl,
    videoUrl,
    backgroundMusicUrl,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
  };
}
