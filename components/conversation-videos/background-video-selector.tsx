"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Video, CheckCircle2, Gamepad2, TramFront } from "lucide-react";

interface BackgroundVideoSelectorProps {
  selectedVideoId: string | null;
  onSelect: (id: string) => void;
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Minecraft: <Gamepad2 className="size-3" />,
  "Subway Surfer": <TramFront className="size-3" />,
};

export function BackgroundVideoSelector({
  selectedVideoId,
  onSelect,
}: BackgroundVideoSelectorProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.stocks.getBackgroundVideos.queryOptions(),
  );
  const videos = data?.videos ?? [];

  // Group by category
  const grouped = videos.reduce<
    Record<string, typeof videos>
  >((acc, v) => {
    const cat = v.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(v);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Background Video
      </label>

      {isLoading ? (
        <div className="h-20 flex items-center justify-center text-sm text-muted-foreground rounded-lg border border-border bg-muted/20">
          Loading videos…
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-2">
              {/* Category label */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">
                  {CATEGORY_ICON[category] ?? <Video className="size-3" />}
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-5 gap-2">
                {items.map((video) => {
                  const isSelected = selectedVideoId === video.id;
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => onSelect(video.id)}
                      className={`group relative aspect-9/16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary shadow-md scale-[1.04]"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      {/* Thumbnail or placeholder */}
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-[9px] font-bold text-center px-1 leading-tight transition-colors ${
                            isSelected
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground group-hover:bg-muted/70"
                          }`}
                        >
                          {video.name}
                        </div>
                      )}

                      {/* Overlay label */}
                      <div
                        className={`absolute inset-0 flex items-end p-1 transition-all ${
                          video.thumbnail
                            ? isSelected
                              ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                              : "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                            : ""
                        }`}
                      >
                        {video.thumbnail && (
                          <span className="text-white text-[8px] font-semibold leading-tight line-clamp-2">
                            {video.name}
                          </span>
                        )}
                      </div>

                      {/* Checkmark */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 size-4 rounded-full bg-primary flex items-center justify-center">
                          <svg
                            viewBox="0 0 12 12"
                            className="size-2.5 text-primary-foreground"
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
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
