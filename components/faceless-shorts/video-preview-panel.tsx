"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Subtitles,
  Sparkles,
  Music2,
  Clock,
  Loader2,
} from "lucide-react";
import {
  VIDEO_STYLES,
  CAPTION_STYLES,
  BACKGROUND_MUSIC,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface VideoPreviewPanelProps {
  selectedStyle: string;
  captionsEnabled: boolean;
  captionStyleId: string;
  backgroundMusicId: string;
  duration: string;
  script: string;
  isGeneratingVideo: boolean;
  onGenerateVideo: () => void;
  hasScript: boolean;
  projectTitle: string;
}

export function VideoPreviewPanel({
  selectedStyle,
  captionsEnabled,
  captionStyleId,
  backgroundMusicId,
  duration,
  script,
  isGeneratingVideo,
  onGenerateVideo,
  hasScript,
  projectTitle,
}: VideoPreviewPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(23);

  const style = VIDEO_STYLES.find((s) => s.id === selectedStyle);
  const captionStyle = CAPTION_STYLES.find((c) => c.id === captionStyleId);
  const music = BACKGROUND_MUSIC.find((m) => m.id === backgroundMusicId);

  const canGenerate = hasScript && selectedStyle;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Video Preview</h3>
        <Badge variant="outline" className="text-xs gap-1">
          <Clock className="h-3 w-3" />
          {duration}s
        </Badge>
      </div>

      {/* Phone Mockup Preview */}
      <div className="flex justify-center">
        <div className="relative w-[200px]">
          {/* Phone frame */}
          <div className="relative w-[250px] h-[480px] rounded-[2rem] border-[6px] border-foreground/20 bg-black overflow-hidden shadow-2xl">
            {/* Status bar */}
            {/* <div className="absolute top-0 left-0 right-0 h-6 bg-black/80 z-20 flex items-center justify-between px-3">
              <span className="text-white text-[8px] font-medium">9:41</span>
              <div className="w-12 h-3 bg-black rounded-full" />
              <div className="flex gap-0.5">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="w-2 h-2 rounded-full bg-white/60" />
              </div>
            </div> */}

            {/* Video content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {style ? (
                  <img
                    src={style.thumbnail}
                    alt={style.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${selectedStyle}/400/700`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-muted to-muted/60 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Sparkles className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                      <p className="text-xs text-muted-foreground/60">
                        Select a style
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Captions overlay */}
            {captionsEnabled && captionStyle && script && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-14 left-0 right-0 z-20 text-center px-3"
              >
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    captionStyle.fontClass,
                  )}
                >
                  {script.slice(0, 60)}...
                </span>
              </motion.div>
            )}

            {/* Title overlay */}
            {projectTitle && (
              <div className="absolute top-7 left-0 right-0 z-20 text-center px-2">
                <p className="text-white text-[8px] font-medium truncate opacity-70">
                  {projectTitle}
                </p>
              </div>
            )}

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-2 space-y-1.5">
              {/* Progress bar */}
              <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5 fill-white" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-white" />
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMuted((p) => !p)}
                    className="text-white hover:text-white/80"
                  >
                    {isMuted ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </button>
                  <span className="text-white text-[8px]">0:00 / 1:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Style label below phone */}
          {style && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center"
            >
              <Badge variant="secondary" className="text-xs">
                {style.label}
              </Badge>
            </motion.div>
          )}
        </div>
      </div>

      {/* Config Summary */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Configuration
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ConfigBadge
            icon={<Subtitles className="h-3 w-3" />}
            label="Captions"
            value={captionsEnabled ? (captionStyle?.label ?? "On") : "Off"}
            active={captionsEnabled}
          />
          <ConfigBadge
            icon={<Music2 className="h-3 w-3" />}
            label="Music"
            value={music?.label ?? "None"}
            active={backgroundMusicId !== "none"}
          />
          <ConfigBadge
            icon={<Sparkles className="h-3 w-3" />}
            label="Style"
            value={style?.label ?? "Not selected"}
            active={!!style}
          />
          <ConfigBadge
            icon={<Clock className="h-3 w-3" />}
            label="Duration"
            value={duration + "s"}
            active={true}
          />
        </div>
      </div>

      {/* Generate Video Button */}
      <div className="mt-auto pt-2">
        {!canGenerate && (
          <p className="text-xs text-muted-foreground text-center mb-2">
            {!hasScript
              ? "Add a script to generate video"
              : "Select a video style first"}
          </p>
        )}
        <Button
          className="w-full gap-2 h-11 text-base font-semibold"
          disabled={!canGenerate || isGeneratingVideo}
          onClick={onGenerateVideo}
          size="lg"
        >
          {isGeneratingVideo ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ConfigBadge({
  icon,
  label,
  value,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 border text-xs transition-colors",
        active
          ? "border-primary/30 bg-accent/30 text-accent-foreground"
          : "border-border bg-muted/20 text-muted-foreground",
      )}
    >
      <span className={active ? "text-primary" : ""}>{icon}</span>
      <div className="min-w-0">
        <p className="font-medium truncate">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
