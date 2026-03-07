"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Wand2 } from "lucide-react";
import { VIDEO_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface VideoStylePickerProps {
  selectedStyle: string;
  onSelectStyle: (id: string) => void;
}

export function VideoStylePicker({
  selectedStyle,
  onSelectStyle,
}: VideoStylePickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-1.5">
        <Wand2 className="h-3.5 w-3.5 text-primary" />
        Video Style
        <Badge variant="secondary" className="text-xs ml-1">
          AI Generated
        </Badge>
      </Label>

      <ScrollArea className="h-auto">
        <div className="grid grid-cols-5 gap-2">
          {VIDEO_STYLES.map((style, i) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              onClick={() => onSelectStyle(style.id)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                selectedStyle === style.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50",
              )}
            >
              {/* Thumbnail */}
              <div className="relative aspect-9/14 bg-muted">
                <img
                  src={style.thumbnail}
                  alt={style.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${style.id}/200/300`;
                  }}
                />
                {/* Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-200",
                    selectedStyle === style.id
                      ? "bg-primary/20"
                      : "bg-black/0 group-hover:bg-black/10",
                  )}
                />
                {/* Check icon */}
                {selectedStyle === style.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5"
                  >
                    <Check className="h-2.5 w-2.5 text-white" />
                  </motion.div>
                )}
              </div>
              {/* Label */}
              <div className="px-1.5 py-1 bg-card">
                <p className="text-xs font-medium text-center truncate">
                  {style.label}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
