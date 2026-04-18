"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ConversationRemotionPlayer from "@/components/remotion/conversation-remotion-player";

import {
  Download,
  Languages,
  Clock,
  Loader2,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Share2,
  CalendarDays,
} from "lucide-react";

import type { VideoStatus, ConversationVideo } from "@/types";
import Header from "../header";

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  VideoStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  GENERATING: {
    label: "Generating",
    variant: "secondary",
    icon: <Loader2 className="size-3 animate-spin" />,
  },
  READY: {
    label: "Ready",
    variant: "default",
    icon: <CheckCircle2 className="size-3" />,
  },
  RENDERING: {
    label: "Rendering",
    variant: "secondary",
    icon: <Loader2 className="size-3 animate-spin" />,
  },
  SUCCESS: {
    label: "Success",
    variant: "default",
    icon: <CheckCircle2 className="size-3" />,
  },
  FAILED: {
    label: "Failed",
    variant: "destructive",
    icon: <AlertCircle className="size-3" />,
  },
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatCreatedAt(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── component ────────────────────────────────────────────────────────────────

export default function ConversationVideoDetailClient({
  videoDetail,
}: {
  videoDetail: any;
}) {
  const trpc = useTRPC();
  const router = useRouter();

  const [status, setStatus] = useState<VideoStatus>(videoDetail.status);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(
    videoDetail.videoUrl ?? null,
  );

  const isRendering = status === "RENDERING";
  const isSuccess = status === "SUCCESS";
  const isReady = status === "READY";

  const hasDownloadUrl = !!downloadUrl;

  const { data: polledData } = useQuery(
    trpc.videos.getVideoStatus.queryOptions(
      { videoId: videoDetail.id },
      {
        enabled: isRendering,
        refetchInterval: isRendering ? 4000 : false,
        staleTime: 0,
      },
    ),
  );

  useEffect(() => {
    if (!polledData) return;

    const newStatus = polledData.status as VideoStatus;
    setStatus(newStatus);

    if (newStatus === "SUCCESS") {
      const url = (polledData as { downloadUrl?: string }).downloadUrl ?? null;
      setDownloadUrl(url);
    }

    if (newStatus === "FAILED") {
      toast.error("Video rendering failed. Please try exporting again.");
    }
  }, [polledData]);

  const exportMutation = useMutation(
    trpc.videos.exportVideo.mutationOptions({
      onSuccess: (data) => {
        if (!data) return;
        const newStatus = data.status as VideoStatus;
        setStatus(newStatus);

        if (newStatus === "SUCCESS") {
          const url = (data as { downloadUrl?: string }).downloadUrl ?? null;
          setDownloadUrl(url);
          toast.success("Video exported successfully!");
        } else if (newStatus === "RENDERING" || newStatus === "READY") {
          toast.success("Export started! We'll notify you when it's ready.");
        }
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to export video.");
      },
    }),
  );

  const handleExport = useCallback(() => {
    exportMutation.mutate({ videoId: videoDetail.id });
  }, [exportMutation, videoDetail.id]);

  const handleDownload = useCallback(async () => {
    if (!downloadUrl) return;
    try {
      toast.loading("Preparing download…", { id: "download" });
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch video");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `shorts-${videoDetail.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      toast.success("Download started!", { id: "download" });
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Download failed. Please try again.", { id: "download" });
    }
  }, [downloadUrl, videoDetail.id]);

  const handleCopy = useCallback(() => {
    if (!downloadUrl) return;
    navigator.clipboard.writeText(downloadUrl);
    toast.success("Video download link copied!");
  }, [downloadUrl]);

  const handleShare = useCallback(async () => {
    if (!downloadUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: videoDetail.script.prompt ?? "ShortsVid",
        url: downloadUrl,
      });
    } else {
      navigator.clipboard.writeText(downloadUrl);
      toast.success("Video download link copied!");
    }
  }, [downloadUrl, videoDetail.script.prompt]);

  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.READY;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background w-full">
        <div className="container pb-4">
          <Header>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 flex justify-between w-full"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                      onClick={handleCopy}
                      disabled={!hasDownloadUrl}
                    >
                      <Copy className="size-4" />
                      Copy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hasDownloadUrl
                      ? "Copy video download link"
                      : "Available after export"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                      onClick={handleShare}
                      disabled={!hasDownloadUrl}
                    >
                      <Share2 className="size-4" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hasDownloadUrl
                      ? "Share video download link"
                      : "Available after export"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          </Header>

          <Separator className="mb-6" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] w-full">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-sm px-2 py-3 rounded-sm font-semibold uppercase tracking-tight"
                >
                  {videoDetail.script.topic}
                </Badge>
                <Badge
                  variant={statusCfg.variant}
                  className="flex items-center gap-1.5 px-2 py-3 text-sm rounded-sm font-medium"
                >
                  {statusCfg.icon}
                  {statusCfg.label}
                </Badge>
              </div>

              {videoDetail.script.prompt ? (
                <h1 className="text-4xl font-semibold leading-snug tracking-tight">
                  {videoDetail.script.prompt}
                </h1>
              ) : (
                <h1 className="text-2xl font-semibold leading-snug tracking-tight text-red-400">
                  No prompt provided
                </h1>
              )}

              {videoDetail.createdAt && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-5" />
                  <span>{formatCreatedAt(videoDetail.createdAt)}</span>
                </div>
              )}

              {videoDetail.script.content.length > 0 && (
                <ScrollArea className="h-50">
                  <div className="flex flex-col gap-4">
                    {videoDetail.script.content.map((line: string, index: number) => (
                      <div key={index} className="flex flex-col p-4 bg-muted/30 rounded-xl border">
                         <span className="text-xs font-semibold text-muted-foreground mb-1">
                           Speaker {index % 2 === 0 ? "1" : "2"}
                         </span>
                         <p className="text-lg leading-relaxed text-foreground">
                           {line}
                         </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="mt-2 flex flex-wrap gap-3">
                <InfoCard>
                  <InfoItem
                    icon={<Languages className="size-4" />}
                    label="Language"
                    value={videoDetail.script.languageCode.toUpperCase()}
                  />
                </InfoCard>

                {videoDetail.duration && (
                  <InfoCard>
                    <InfoItem
                      icon={<Clock className="size-4" />}
                      label="Duration"
                      value={formatDuration(videoDetail.duration)}
                    />
                  </InfoCard>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Preview
              </p>

              <div className="">
                <ConversationRemotionPlayer
                  videoData={{
                    id: videoDetail.id,
                    duration: videoDetail.duration!,
                    caption: videoDetail.caption,
                    captionConfig: videoDetail.captionConfig,
                    speaker1AvatarUrl: videoDetail.speaker1AvatarUrl,
                    speaker2AvatarUrl: videoDetail.speaker2AvatarUrl,
                    audioUrl: videoDetail.audioUrl,
                    backgroundVideoUrl: videoDetail.backgroundVideoUrl,
                    backgroundMusicUrl: videoDetail.backgroundMusicUrl,
                    script: videoDetail.script,
                  }}
                />
              </div>

              <div className="mt-1">
                {isReady && (
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleExport}
                    disabled={exportMutation.isPending}
                  >
                    {exportMutation.isPending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Upload className="size-5" />
                    )}
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                  </Button>
                )}

                {isRendering && (
                  <Button className="w-full gap-2" disabled>
                    <Loader2 className="size-4 animate-spin" />
                    Exporting…
                  </Button>
                )}

                {isSuccess && downloadUrl && (
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-foreground text-background hover:bg-foreground hover:text-muted cursor-pointer"
                    onClick={handleDownload}
                  >
                    <Download className="size-4" />
                    Download Video
                  </Button>
                )}

                {status === "FAILED" && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    Rendering failed. Please try exporting again.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function InfoItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-base font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <span
        className={`flex items-center gap-2 text-sm font-semibold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-xl border px-5 py-4 transition
      ${highlight ? "border-primary/50 bg-primary/5" : "bg-muted/40"}
      hover:bg-muted`}
    >
      {children}
    </div>
  );
}
