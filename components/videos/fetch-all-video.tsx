"use client";

import { AllShorts } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import React from "react";
import { Button } from "../ui/button";

// Flexible type that accommodates both Faceless and Conversation video fields.
interface VideoCardProps {
  videoData: any;
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

  const videoType = videoData.videoStyle
    ? "faceless-shorts"
    : "conversation-video";

  const handleCardClick = () => {
    router.push(`/app/library/${videoType}/${videoData.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate({ videoId: videoData.id });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/app/library/${videoType}/${videoData.id}`;
    if (navigator.share) {
      await navigator.share({
        title: videoData.script?.prompt ?? "ShortsVid",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Video link copied to clipboard!");
    }
  };

  const formattedDate = moment(videoData.createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-[250px] flex flex-col gap-3 p-2 bg-card border border-border shadow-sm rounded-[20px] cursor-pointer group/card transition-all hover:shadow-md"
      onClick={handleCardClick}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-9/16 rounded-[16px] overflow-hidden bg-muted flex-shrink-0">
        {videoData.signedThumbnailUrl && (
          <Image
            src={videoData.signedThumbnailUrl}
            alt="video thumbnail"
            fill
            className="object-cover object-center"
            unoptimized
          />
        )}

        {/* Play Button Overlay (Hover) */}
        {videoData.status === "SUCCESS" && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center z-40">
            <div className="bg-white/30 backdrop-blur-md p-3 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover/card:scale-100 transition-transform duration-300">
              <Play className="size-6 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* FAILED overlay */}
        {videoData.status === "FAILED" && (
          <div className="absolute inset-0 z-10 flex flex-col gap-2 items-center justify-center bg-black/60 tracking-tight">
            <CircleAlert className="size-6 text-destructive" />
            <span className="text-destructive text-xs font-medium">Failed</span>
          </div>
        )}

        {/* GENERATING overlay */}
        {videoData.status === "GENERATING" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm tracking-tight">
            <Spinner className="size-6 text-white" />
            <span className="text-white text-xs font-medium">Generating</span>
          </div>
        )}
      </div>

      {/* Info Row: Title and Time Ago, plus Ellipsis */}
      <div className="flex items-start justify-between gap-1 px-1 pb-1">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold text-foreground/90 truncate leading-tight transition-colors">
            {videoData.script?.prompt ?? "Untitled video"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 tracking-tight">
            {formattedDate}
          </p>
        </div>

        {/* Ellipsis menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-1 -mr-1 rounded-md text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 z-50">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/app/library/${videoType}/${videoData.id}`);
              }}
              className="gap-2 cursor-pointer"
            >
              <FileText className="size-3.5" />
              Description
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleShare}
              className="gap-2 cursor-pointer hover:bg-muted"
            >
              <Share2 className="size-3.5" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              {deleteMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              {deleteMutation.isPending ? "Generating..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
