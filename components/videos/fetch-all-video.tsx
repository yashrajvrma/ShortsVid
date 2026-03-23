"use client";

import { AllShorts } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Spinner } from "@/components/ui/spinner";
import { CircleAlert } from "lucide-react";

export default function FetchAllVideo({ videoData }: { videoData: AllShorts }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/app/videos/${videoData.id}`);
  };

  const duration = videoData.duration
    ? `${Math.floor(videoData.duration / 60)}:${String(
        Math.floor(videoData.duration % 60),
      ).padStart(2, "0")}`
    : null;

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-[200px] cursor-pointer hover:scale-[1.03] transition-transform"
    >
      <AspectRatio
        ratio={9 / 16}
        className="relative rounded-xl overflow-hidden bg-muted border-2 border-double"
      >
        {/* Thumbnail */}
        {videoData.signedThumbnailUrl && (
          <Image
            src={videoData.signedThumbnailUrl}
            alt="video thumbnail"
            fill
            className="object-cover"
            unoptimized
          />
        )}

        {/* Duration badge (YouTube style) */}
        {duration && videoData.status === "SUCCESS" && (
          <div className="absolute bottom-2 right-2 text-white text-xs font-medium bg-black/30 px-2 py-1 rounded">
            {duration}
          </div>
        )}

        {/* FAILED overlay */}
        {videoData.status === "FAILED" && (
          <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/50">
            <CircleAlert className="size-6 text-red-500" />
            <span className="text-red-500 text-sm tracking-wide">
              Failed to generate
            </span>
          </div>
        )}

        {/* GENERATING overlay */}
        {videoData.status === "GENERATING" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
            <Spinner className="size-6 text-white" />
            <span className="text-white text-sm font-medium">
              Generating...
            </span>
          </div>
        )}
      </AspectRatio>
    </div>
  );
}
