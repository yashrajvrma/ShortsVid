"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Subtitles, Music2, Volume2 } from "lucide-react";
import { CAPTION_STYLES, BACKGROUND_MUSIC } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CaptionsMusicConfigProps {
  captionsEnabled: boolean;
  onCaptionsToggle: (v: boolean) => void;
  captionStyleId: string;
  onCaptionStyleChange: (v: string) => void;
  backgroundMusicId: string;
  onMusicChange: (v: string) => void;
}

export function CaptionsMusicConfig({
  captionsEnabled,
  onCaptionsToggle,
  captionStyleId,
  onCaptionStyleChange,
  backgroundMusicId,
  onMusicChange,
}: CaptionsMusicConfigProps) {
  const selectedMusic = BACKGROUND_MUSIC.find(
    (m) => m.id === backgroundMusicId,
  );

  return (
    <div className="space-y-5">
      {/* Captions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <Subtitles className="h-3.5 w-3.5 text-primary" />
            Captions
          </Label>
          <Switch
            checked={captionsEnabled}
            onCheckedChange={onCaptionsToggle}
          />
        </div>

        <AnimatePresence>
          {captionsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Caption Style
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {CAPTION_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onCaptionStyleChange(style.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-muted/30",
                        captionStyleId === style.id
                          ? "border-primary bg-accent/40"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="h-8 flex items-center justify-center bg-black/80 rounded w-full px-1 overflow-hidden">
                        <span
                          className={cn("text-[9px] truncate", style.fontClass)}
                        >
                          {style.preview}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
                        {style.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Music */}
      <div className="space-y-2 mb-20">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Music2 className="h-3.5 w-3.5 text-primary" />
          Background Music
        </Label>
        <Select value={backgroundMusicId} onValueChange={onMusicChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {selectedMusic && (
                <span className="flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{selectedMusic.label}</span>
                  {selectedMusic.genre !== "None" && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {selectedMusic.genre}
                    </Badge>
                  )}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BACKGROUND_MUSIC.map((music) => (
              <SelectItem key={music.id} value={music.id}>
                <span className="flex items-center gap-2 w-full">
                  <span>{music.label}</span>
                  {music.genre !== "None" && (
                    <Badge variant="outline" className="text-xs ml-auto">
                      {music.genre}
                    </Badge>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
