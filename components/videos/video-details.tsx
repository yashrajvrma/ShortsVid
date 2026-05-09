// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useTRPC } from "@/trpc/client";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { toast } from "sonner";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import RemotionPlayer from "@/components/remotion/remotion-player";

// import {
//   Download,
//   Languages,
//   Mic,
//   Music,
//   Clock,
//   Loader2,
//   Upload,
//   CheckCircle2,
//   AlertCircle,
//   ArrowLeft,
//   Copy,
//   Share2,
//   CalendarDays,
// } from "lucide-react";

// import type { VideoDetail, VideoStatus } from "@/types";
// import Header from "../header";

// // ── helpers ──────────────────────────────────────────────────────────────────

// const STATUS_CONFIG: Record<
//   VideoStatus,
//   {
//     label: string;
//     variant: "default" | "secondary" | "destructive" | "outline";
//     icon: React.ReactNode;
//   }
// > = {
//   GENERATING: {
//     label: "Generating",
//     variant: "secondary",
//     icon: <Loader2 className="size-3 animate-spin" />,
//   },
//   READY: {
//     label: "Ready",
//     variant: "default",
//     icon: <CheckCircle2 className="size-3" />,
//   },
//   RENDERING: {
//     label: "Rendering",
//     variant: "secondary",
//     icon: <Loader2 className="size-3 animate-spin" />,
//   },
//   SUCCESS: {
//     label: "Success",
//     variant: "default",
//     icon: <CheckCircle2 className="size-3" />,
//   },
//   FAILED: {
//     label: "Failed",
//     variant: "destructive",
//     icon: <AlertCircle className="size-3" />,
//   },
// };

// function formatDuration(seconds: number | null): string {
//   if (!seconds) return "—";
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return m > 0 ? `${m}m ${s}s` : `${s}s`;
// }

// function formatCreatedAt(date: Date | string): string {
//   const d = new Date(date);
//   return d.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// // ── component ────────────────────────────────────────────────────────────────

// export default function VideoDetailClient({
//   videoDetail,
// }: {
//   videoDetail: any;
// }) {
//   const trpc = useTRPC();
//   const router = useRouter();

//   const [status, setStatus] = useState<VideoStatus>(videoDetail.status);
//   const [downloadUrl, setDownloadUrl] = useState<string | null>(
//     videoDetail.videoUrl ?? null,
//   );

//   const isRendering = status === "RENDERING";
//   const isSuccess = status === "SUCCESS";
//   const isReady = status === "READY";

//   // Copy & Share are only enabled when downloadUrl is available
//   const hasDownloadUrl = !!downloadUrl;

//   // ── polling: only when RENDERING ─────────────────────────────────────────
//   const { data: polledData } = useQuery(
//     trpc.videos.getVideoStatus.queryOptions(
//       { videoId: videoDetail.id, type: "faceless-shorts" },
//       {
//         enabled: isRendering,
//         refetchInterval: isRendering ? 4000 : false,
//         staleTime: 0,
//       },
//     ),
//   );

//   useEffect(() => {
//     if (!polledData) return;

//     const newStatus = polledData.status as VideoStatus;
//     setStatus(newStatus);

//     if (newStatus === "SUCCESS") {
//       const url = (polledData as { downloadUrl?: string }).downloadUrl ?? null;
//       setDownloadUrl(url);
//     }

//     if (newStatus === "FAILED") {
//       toast.error("Video rendering failed. Please try exporting again.");
//     }
//   }, [polledData]);

//   // ── export mutation ───────────────────────────────────────────────────────
//   const exportMutation = useMutation(
//     trpc.videos.exportVideo.mutationOptions({
//       onSuccess: (data) => {
//         if (!data) return;
//         const newStatus = data.status as VideoStatus;
//         setStatus(newStatus);

//         if (newStatus === "SUCCESS") {
//           const url = (data as { downloadUrl?: string }).downloadUrl ?? null;
//           setDownloadUrl(url);
//           toast.success("Video exported successfully!");
//         } else if (newStatus === "RENDERING" || newStatus === "READY") {
//           toast.success("Export started! We'll notify you when it's ready.");
//         }
//       },
//       onError: (err) => {
//         toast.error(err.message ?? "Failed to export video.");
//       },
//     }),
//   );

//   const handleExport = useCallback(() => {
//     exportMutation.mutate({ videoId: videoDetail.id });
//   }, [exportMutation, videoDetail.id]);

//   // ── download ──────────────────────────────────────────────────────────────
//   // const handleDownload = useCallback(() => {
//   //   if (!downloadUrl) return;
//   //   const a = document.createElement("a");
//   //   a.href = downloadUrl;
//   //   a.download = `shorts-${videoDetail.id}.mp4`;
//   //   document.body.appendChild(a);
//   //   a.click();
//   //   document.body.removeChild(a);
//   // }, [downloadUrl, videoDetail.id]);
//   const handleDownload = useCallback(async () => {
//     if (!downloadUrl) return;
//     try {
//       toast.loading("Preparing download…", { id: "download" });
//       const response = await fetch(downloadUrl);
//       if (!response.ok) throw new Error("Failed to fetch video");
//       const blob = await response.blob();
//       const blobUrl = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = blobUrl;
//       a.download = `shorts-${videoDetail.id}.mp4`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       // Release the object URL after a short delay
//       setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
//       toast.success("Download started!", { id: "download" });
//     } catch (err) {
//       console.error("Download failed", err);
//       toast.error("Download failed. Please try again.", { id: "download" });
//     }
//   }, [downloadUrl, videoDetail.id]);

//   // ── copy video download URL ───────────────────────────────────────────────
//   const handleCopy = useCallback(() => {
//     if (!downloadUrl) return;
//     navigator.clipboard.writeText(downloadUrl);
//     toast.success("Video download link copied!");
//   }, [downloadUrl]);

//   // ── share video download URL ──────────────────────────────────────────────
//   const handleShare = useCallback(async () => {
//     if (!downloadUrl) return;
//     if (navigator.share) {
//       await navigator.share({
//         title: videoDetail.script.prompt ?? "ShortsVid",
//         url: downloadUrl,
//       });
//     } else {
//       navigator.clipboard.writeText(downloadUrl);
//       toast.success("Video download link copied!");
//     }
//   }, [downloadUrl, videoDetail.script.prompt]);

//   const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.READY;

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen bg-background w-full">
//         <div className="container pb-4">
//           {/* ── top nav bar ── */}
//           <Header>
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-4 flex justify-between w-full"
//             >
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="gap-1.5 text-muted-foreground hover:text-foreground"
//                 onClick={() => router.back()}
//               >
//                 <ArrowLeft className="size-4" />
//                 Back
//               </Button>

//               <div className="flex items-center gap-2">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="lg"
//                       className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
//                       onClick={handleCopy}
//                       disabled={!hasDownloadUrl}
//                     >
//                       <Copy className="size-4" />
//                       Copy
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {hasDownloadUrl
//                       ? "Copy video download link"
//                       : "Available after export"}
//                   </TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="default"
//                       className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
//                       onClick={handleShare}
//                       disabled={!hasDownloadUrl}
//                     >
//                       <Share2 className="size-4" />
//                       Share
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {hasDownloadUrl
//                       ? "Share video download link"
//                       : "Available after export"}
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//             </motion.div>
//           </Header>

//           <Separator className="mb-6" />

//           {/* ── 2-col layout ── */}
//           <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] w-full">
//             {/* ── LEFT: content ── */}
//             <motion.div
//               initial={{ opacity: 0, x: -12 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.35, delay: 0.05 }}
//               className="flex flex-col gap-5"
//             >
//               {/* Topic · Style · Status badges */}
//               <div className="flex flex-wrap items-center gap-2">
//                 <Badge
//                   variant="outline"
//                   className="text-sm px-2 py-3 rounded-sm font-semibold uppercase tracking-tight"
//                 >
//                   {videoDetail.script.topic}
//                 </Badge>
//                 <Badge
//                   variant="outline"
//                   className="text-sm px-2 py-3 rounded-sm font-semibold uppercase tracking-tight"
//                 >
//                   {videoDetail.videoStyle}
//                 </Badge>
//                 <Badge
//                   variant={statusCfg.variant}
//                   className="flex items-center gap-1.5 px-2 py-3 text-sm rounded-sm font-medium"
//                 >
//                   {statusCfg.icon}
//                   {statusCfg.label}
//                 </Badge>
//               </div>

//               {/* Prompt — large heading */}
//               {videoDetail.script.prompt ? (
//                 <h1 className="text-4xl font-semibold leading-snug tracking-tight">
//                   {videoDetail.script.prompt}
//                 </h1>
//               ) : (
//                 <h1 className="text-2xl font-semibold leading-snug tracking-tight text-red-400">
//                   No prompt provided
//                 </h1>
//               )}

//               {/* Created at */}
//               {videoDetail.createdAt && (
//                 <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
//                   <CalendarDays className="size-5" />
//                   <span>{formatCreatedAt(videoDetail.createdAt)}</span>
//                 </div>
//               )}

//               {/* Script body */}
//               {videoDetail.script.content.length > 0 && (
//                 <ScrollArea className="h-50">
//                   <p className="text-lg leading-relaxed text-muted-foreground">
//                     {videoDetail.script.content.join(" ")}
//                   </p>
//                 </ScrollArea>
//               )}

//               {/* ── Info items — individual auto-width cards ── */}
//               <div className="mt-2 flex flex-wrap gap-3">
//                 <InfoCard>
//                   <InfoItem
//                     icon={<Languages className="size-4" />}
//                     label="Language"
//                     value={videoDetail.script.languageCode.toUpperCase()}
//                   />
//                 </InfoCard>

//                 {videoDetail.duration && (
//                   <InfoCard>
//                     <InfoItem
//                       icon={<Clock className="size-4" />}
//                       label="Duration"
//                       value={formatDuration(videoDetail.duration)}
//                     />
//                   </InfoCard>
//                 )}

//                 {videoDetail.voice && (
//                   <InfoCard>
//                     <InfoItem
//                       icon={<Mic className="size-4" />}
//                       label="Voice"
//                       value={videoDetail.voice.name}
//                     />
//                   </InfoCard>
//                 )}

//                 {/* {videoDetail.audioUrl && (
//                   <InfoCard highlight>
//                     <InfoItem
//                       icon={<Music className="size-4" />}
//                       label="Audio"
//                       value="Ready"
//                       highlight
//                     />
//                   </InfoCard>
//                 )} */}
//               </div>
//             </motion.div>

//             {/* ── RIGHT: player ── */}
//             <motion.div
//               initial={{ opacity: 0, x: 12 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.35, delay: 0.1 }}
//               className="flex flex-col gap-3"
//             >
//               <p className="text-sm font-medium text-muted-foreground">
//                 Preview
//               </p>

//               <div className="">
//                 <RemotionPlayer
//                   videoData={{
//                     id: videoDetail.id,
//                     duration: videoDetail.duration!,
//                     caption: videoDetail.caption,
//                     captionConfig: videoDetail.captionConfig,
//                     imagesUrl: videoDetail.imagesUrl,
//                     audioUrl: videoDetail.audioUrl,
//                     backgroundMusicUrl: videoDetail.backgroundMusicUrl,
//                   }}
//                 />
//               </div>

//               {/* Export / Download */}
//               <div className="mt-1">
//                 {isReady && (
//                   <Button
//                     size="lg"
//                     className="w-full gap-2"
//                     onClick={handleExport}
//                     disabled={exportMutation.isPending}
//                   >
//                     {exportMutation.isPending ? (
//                       <Loader2 className="size-5 animate-spin" />
//                     ) : (
//                       <Upload className="size-5" />
//                     )}
//                     {exportMutation.isPending ? "Exporting..." : "Export"}
//                   </Button>
//                 )}

//                 {isRendering && (
//                   <Button className="w-full gap-2" disabled>
//                     <Loader2 className="size-4 animate-spin" />
//                     Exporting…
//                   </Button>
//                 )}

//                 {isSuccess && downloadUrl && (
//                   <Button
//                     size="lg"
//                     className="w-full gap-2 bg-foreground text-background hover:bg-foreground hover:text-muted cursor-pointer"
//                     onClick={handleDownload}
//                   >
//                     <Download className="size-4" />
//                     Download Video
//                   </Button>
//                 )}

//                 {status === "FAILED" && (
//                   <p className="mt-2 text-center text-sm text-destructive">
//                     Rendering failed. Please try exporting again.
//                   </p>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

// // ── sub-components ────────────────────────────────────────────────────────────

// function InfoItem({
//   icon,
//   label,
//   value,
//   highlight,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <span className="flex items-center gap-1 text-base font-medium text-muted-foreground">
//         {icon}
//         {label}
//       </span>
//       <span
//         className={`flex items-center gap-2 text-sm font-semibold ${
//           highlight ? "text-primary" : "text-foreground"
//         }`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

// function InfoCard({
//   children,
//   highlight,
// }: {
//   children: React.ReactNode;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={`inline-flex rounded-xl border px-5 py-4 transition
//       ${highlight ? "border-primary/50 bg-primary/5" : "bg-muted/40"}
//       hover:bg-muted`}
//     >
//       {children}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import RemotionPlayer from "@/components/remotion/remotion-player";

import {
  Download,
  Languages,
  Mic,
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

import type { VideoStatus } from "@/types";
import Image from "next/image";

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

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

// ── component ────────────────────────────────────────────────────────────────

export default function VideoDetailClient({
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
      { videoId: videoDetail.id, type: "faceless-shorts" },
      {
        enabled: isRendering,
        refetchInterval: isRendering ? 4000 : false,
        staleTime: 0,
      },
    ),
  );

  console.log("video data is", JSON.stringify(videoDetail));
  // Fetch all faceless videos for the sidebar
  const { data: allVideos } = useQuery(trpc.videos.getAllShorts.queryOptions());

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
    toast.success("Video link copied!");
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
      toast.success("Video link copied!");
    }
  }, [downloadUrl, videoDetail.script.prompt]);

  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.READY;

  return (
    <TooltipProvider>
      <div
        className="bg-background flex flex-col w-full"
        style={{ height: "calc(100vh)" }}
      >
        {/* ── Top Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-between py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-20 w-full border-b border-border"
        >
          <Button
            variant="outline"
            size="sm"
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
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  onClick={handleCopy}
                  disabled={!hasDownloadUrl}
                >
                  <Copy className="size-4" />
                  Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasDownloadUrl ? "Copy video link" : "Available after export"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  onClick={handleShare}
                  disabled={!hasDownloadUrl}
                >
                  <Share2 className="size-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasDownloadUrl ? "Share video link" : "Available after export"}
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left 70%: Player + Detail ── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col lg:flex-row flex-1 lg:w-[70%] min-w-0 py-4 gap-4 overflow-y-auto"
          >
            {/* Video Player Column */}
            <div className="shrink-0 h-full sm:pb-16 pb-14">
              <RemotionPlayer
                videoData={{
                  id: videoDetail.id,
                  duration: videoDetail.duration!,
                  caption: videoDetail.caption,
                  captionConfig: videoDetail.captionConfig,
                  imagesUrl: videoDetail.imagesUrl,
                  audioUrl: videoDetail.audioUrl,
                  backgroundMusicUrl: videoDetail.backgroundMusicUrl,
                }}
                className="h-full w-auto aspect-[9/16]"
              />
            </div>

            {/* Detail Column */}
            <div className="flex flex-col justify-between sm:px-6 px-0 gap-4">
              <div className="flex flex-col gap-4 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-sm font-medium uppercase tracking-tight text-muted-foreground"
                  >
                    {videoDetail.script.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-sm font-medium uppercase tracking-tight text-muted-foreground"
                  >
                    {videoDetail.videoStyle}
                  </Badge>
                  <Badge
                    variant={statusCfg.variant}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-sm font-medium"
                  >
                    {statusCfg.icon}
                    {statusCfg.label}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-medium leading-snug tracking-tight">
                  {videoDetail.script.prompt ?? (
                    <span className="text-destructive">No prompt provided</span>
                  )}
                </h1>

                {/* Date */}
                {videoDetail.createdAt && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <span>{formatCreatedAt(videoDetail.createdAt)}</span>
                  </div>
                )}

                {/* Script — plain joined text for faceless */}
                {videoDetail.script.content?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Script
                    </p>
                    <ScrollArea className="max-h-[500px] pr-2">
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {videoDetail.script.content.join(" ")}
                      </p>
                    </ScrollArea>
                  </div>
                )}

                {/* Info Cards */}
                <div className="flex flex-wrap gap-3 mt-1">
                  <InfoCard>
                    <InfoItem
                      icon={<Languages className="size-4" />}
                      label="Language"
                      value={
                        videoDetail.script.languageCode?.toUpperCase() ?? "EN"
                      }
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

                  {videoDetail.voice && (
                    <InfoCard>
                      <InfoItem
                        icon={<Mic className="size-4" />}
                        label="Voice"
                        value={videoDetail.voice.name}
                      />
                    </InfoCard>
                  )}
                </div>
              </div>

              {/* Export / Download — bottom of detail column */}
              <div className="w-full sm:pb-16">
                {isReady && (
                  <Button
                    size="lg"
                    className="w-full gap-2 h-12 text-base"
                    onClick={handleExport}
                    disabled={exportMutation.isPending}
                  >
                    {exportMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    {exportMutation.isPending ? "Exporting..." : "Export"}
                  </Button>
                )}

                {isRendering && (
                  <Button
                    className="w-full gap-2 h-12 text-base"
                    disabled
                    size="lg"
                  >
                    <Loader2 className="size-4 animate-spin" />
                    Exporting…
                  </Button>
                )}

                {isSuccess && downloadUrl && (
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer h-12 text-base"
                    onClick={handleDownload}
                  >
                    <Download className="size-4" />
                    Download Video
                  </Button>
                )}

                {status === "FAILED" && (
                  <p className="text-center text-sm text-destructive mt-1">
                    Rendering failed. Try exporting again.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right 30%: All Videos — only this scrolls, hidden on mobile ── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:flex flex-col w-[30%] border-l border-border p-4 overflow-y-auto"
          >
            <h2 className="text-base font-semibold mb-4">All Videos</h2>

            {!allVideos || allVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <p className="text-sm">No videos yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {allVideos.map((video: any) => (
                  <VideoThumbnailCard
                    key={video.id}
                    video={video}
                    isActive={video.id === videoDetail.id}
                    onClick={() => router.push(`/app/videos/${video.id}`)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ── Video Thumbnail Card ──────────────────────────────────────────────────────

function VideoThumbnailCard({
  video,
  isActive,
  onClick,
}: {
  video: any;
  isActive: boolean;
  onClick: () => void;
}) {
  console.log(" video is", JSON.stringify(video));
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col gap-1.5 cursor-pointer rounded-[20px] overflow-hidden transition-all duration-200 p-1.5 border-2`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] w-full bg-muted rounded-[16px] overflow-hidden">
        {video.signedThumbnailUrl ? (
          <Image
            src={video.signedThumbnailUrl}
            alt={video.script?.prompt ?? "video thumbnail"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={100}
            height={100}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs">No preview</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
          {video.script?.prompt ?? "Untitled"}
        </p>
        {video.createdAt && (
          <p className="text-sm text-muted-foreground">
            {timeAgo(video.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── InfoItem & InfoCard ───────────────────────────────────────────────────────

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
      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-xl border px-4 py-3 bg-muted/40 hover:bg-muted transition-colors">
      {children}
    </div>
  );
}
