"use client";

import { VIDEO_STYLES } from "@/lib/constants";
import { ImageIcon } from "lucide-react";

interface VideoStylePickerProps {
  selectedStyle: string;
  onSelect: (id: string) => void;
}

export function VideoStylePicker({
  selectedStyle,
  onSelect,
}: VideoStylePickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Choose your Video Style
      </label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 py-2">
        {VIDEO_STYLES.map((style) => (
          <button
            key={`${style.id}-${style.label}`}
            type="button"
            onClick={() => onSelect(String(style.id))}
            className={`group relative aspect-9/16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedStyle === String(style.id)
                ? "border-primary shadow-md scale-[1.02]"
                : "border-transparent hover:border-border"
            }`}
          >
            {style.thumbnail ? (
              <img
                src={style.thumbnail}
                alt={style.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <ImageIcon className="size-5 text-muted-foreground" />
              </div>
            )}
            {/* Overlay label */}
            <div
              className={`absolute inset-0 flex items-end p-1.5 transition-all ${
                selectedStyle === String(style.id)
                  ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  : "bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100"
              }`}
            >
              <span className="text-white text-xs font-medium leading-tight line-clamp-2">
                {style.label}
              </span>
            </div>
            {/* Selected checkmark */}
            {selectedStyle === String(style.id) && (
              <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary flex items-center justify-center">
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
        ))}
      </div>
    </div>
  );
}
