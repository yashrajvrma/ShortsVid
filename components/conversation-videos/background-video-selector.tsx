"use client";

import { useState, useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gamepad2, TramFront, VideoIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BackgroundVideoSelectorProps {
  selectedVideoId: string | null;
  onSelect: (id: string) => void;
}

// Derive category from name
function getCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("minecraft")) return "Minecraft";
  if (lower.includes("subway")) return "Subway Surfer";
  return "Other";
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Minecraft: <Gamepad2 className="size-3" />,
  "Subway Surfer": <TramFront className="size-3" />,
  Other: <VideoIcon className="size-3" />,
};

// ── VideoCard — hover fetches the real video URL and plays it ────────────────
function VideoCard({
  video,
  isSelected,
  onSelect,
}: {
  video: { id: string; name: string; thumbnailUrl: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trpc = useTRPC();

  const { data: detail } = useQuery({
    ...trpc.stocks.getBackgroundVideoById.queryOptions({ videoId: video.id }),
    enabled: hovered,
    staleTime: 5 * 60 * 1000,
  });

  const videoUrl = detail?.videoUrl ?? null;

  // Auto-play when videoUrl resolves while still hovering
  useEffect(() => {
    if (videoUrl && hovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl, hovered]);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative aspect-9/16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        isSelected
          ? "border-secondary shadow-md scale-[1.04]"
          : "border-transparent hover:border-border"
      }`}
    >
      {/* Thumbnail — always rendered as base layer */}
      <img
        src={video.thumbnailUrl}
        alt={video.name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          hovered && videoUrl ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video — only mounted when hovered; fades in once URL resolves */}
      {hovered && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay gradient + label */}
      {/* <div
        className={`absolute inset-0 flex items-end p-1.5 transition-all ${
          isSelected
            ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            : "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
        }`}
      >
        <span className="text-white text-[8px] font-semibold leading-tight line-clamp-2">
          {video.name}
        </span>
      </div> */}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-1 right-1 size-4 rounded-full bg-secondary-foreground flex items-center justify-center">
          <svg
            viewBox="0 0 12 12"
            className="size-2.5 text-secondary"
            fill="currentColor"
          >
            <path
              d="M10 3L5 8.5 2 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BackgroundVideoSelector({
  selectedVideoId,
  onSelect,
}: BackgroundVideoSelectorProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.stocks.getSystemBackgroundVideos.queryOptions(),
  );
  const videos = data?.videos ?? [];

  // Group by derived category
  const grouped = videos.reduce<Record<string, typeof videos>>((acc, v) => {
    const cat = getCategory(v.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(v);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Background Video
      </label>
      {/* <p className="text-xs text-muted-foreground -mt-1">
        Hover a clip to preview it
      </p> */}

      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground rounded-lg border border-border bg-muted/20">
          Loading videos…
        </div>
      ) : videos.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground rounded-lg border border-border bg-muted/20">
          No background videos available
        </div>
      ) : (
        <ScrollArea className="[&>div>div[style]]:!block h-[500px] rounded-lg border border-border bg-muted/10 mt-3">
          <div className="p-3 space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="space-y-2">
                {/* Category label */}
                {/* <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">
                    {CATEGORY_ICON[category] ?? (
                      <VideoIcon className="size-3" />
                    )}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </span>
                </div> */}

                {/* Grid — 5 cols, aspect-9/16 cards */}
                <div className="grid grid-cols-5 gap-2">
                  {items.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      isSelected={selectedVideoId === video.id}
                      onSelect={() => onSelect(video.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
