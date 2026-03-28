"use client";

import { AllShorts } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleAlert,
  EllipsisVertical,
  FileText,
  Share2,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client"; // adjust to your trpc client path
import { toast } from "sonner";

interface VideoCardProps {
  videoData: AllShorts;
  onDeleteSuccess?: (id: string) => void;
}

export default function VideoCard({
  videoData,
  onDeleteSuccess,
}: VideoCardProps) {
  const router = useRouter();
  const trpc = useTRPC();

  const deleteMutation = useMutation(
    trpc.videos.deleteVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video deleted successfully.");
        onDeleteSuccess?.(videoData.id);
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to delete video.");
      },
    }),
  );

  const handleCardClick = () => {
    router.push(`/app/videos/${videoData.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate({ videoId: videoData.id });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/app/videos/${videoData.id}`;
    if (navigator.share) {
      await navigator.share({
        title: videoData.script.prompt ?? "ShortsVid",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Video link copied to clipboard!");
    }
  };

  const duration = videoData.duration
    ? `${Math.floor(videoData.duration / 60)}:${String(
        Math.floor(videoData.duration % 60),
      ).padStart(2, "0")}`
    : null;

  const formattedDate = moment(videoData.createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-[160px] sm:max-w-[250px] lg:max-w-[350px] flex flex-col gap-2"
    >
      {/* Thumbnail */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="cursor-pointer relative"
      >
        <AspectRatio
          ratio={16 / 9}
          className="relative rounded-xl overflow-hidden bg-muted border border-border"
        >
          {videoData.signedThumbnailUrl && (
            <Image
              src={videoData.signedThumbnailUrl}
              alt="video thumbnail"
              fill
              className="object-cover object-center"
              unoptimized
            />
          )}

          {/* Duration badge */}
          {duration && videoData.status === "SUCCESS" && (
            <div className="absolute bottom-2 right-2 text-white text-xs font-medium bg-black/60 px-1.5 py-0.5 rounded-md tabular-nums">
              {duration}
            </div>
          )}

          {/* FAILED overlay */}
          {videoData.status === "FAILED" && (
            <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/60">
              <CircleAlert className="size-5 text-destructive" />
              <span className="text-destructive text-xs tracking-wide font-medium">
                Failed to generate
              </span>
            </div>
          )}

          {/* GENERATING overlay */}
          {videoData.status === "GENERATING" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
              <Spinner className="size-5 text-white" />
              <span className="text-white text-xs font-medium">
                Generating...
              </span>
            </div>
          )}
        </AspectRatio>
      </motion.div>

      {/* Info row */}
      <div className="flex items-start justify-between gap-1 px-0.5">
        <div
          onClick={handleCardClick}
          className="flex-1 min-w-0 cursor-pointer group"
        >
          <p className="text-sm font-medium text-foreground leading-snug truncate group-hover:text-primary transition-colors">
            {videoData.script.prompt ?? "Untitled video"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formattedDate}
          </p>
        </div>

        {/* Ellipsis menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/videos/${videoData.id}`);
              }}
              className="gap-2 cursor-pointer"
            >
              <FileText className="size-3.5" />
              Description
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleShare}
              className="gap-2 cursor-pointer"
            >
              <Share2 className="size-3.5" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              {deleteMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
