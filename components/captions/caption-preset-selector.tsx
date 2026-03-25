"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CaptionsOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CAPTION_PRESETS } from "@/lib/constants";
import type { CaptionStyle } from "@/types";

// ─── Animation CSS ────────────────────────────────────────────────────────────

const ANIM_CSS = `
@keyframes cp-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes cp-fade {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes cp-slide {
  0%   { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0);   opacity: 1; }
}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = ANIM_CSS;
  document.head.appendChild(tag);
  cssInjected = true;
}

// ─── Preview words ────────────────────────────────────────────────────────────

// const WORDS = ["A LOT OF", "MY CLIENTS", "WITH SHORT", "HAIR OR", "BOB LENGTH"];
const WORDS = ["THE", "SECRET", "TO", "GOING", "VIRAL", "IS"];

// ─── AnimatedCaptionPreview ───────────────────────────────────────────────────

function AnimatedCaptionPreview({ style }: { style: CaptionStyle }) {
  useEffect(() => {
    injectCSS();
  }, []);

  const [activeIdx, setActiveIdx] = useState(0);
  const idxRef = useRef(0);

  // Reset when style changes
  useEffect(() => {
    idxRef.current = 0;
    setActiveIdx(0);
  }, [style]);

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % WORDS.length;
      setActiveIdx(idxRef.current);
    }, 800);
    return () => clearInterval(id);
  }, []);

  // Show a 2-line window of words around the active one
  const wordsPerLine = style.maxWordsPerLine ?? 2;
  const maxLines = style.maxLines ?? 2;
  const totalVisible = wordsPerLine * maxLines;

  // Build lines from a slice of WORDS
  const startIdx = Math.floor(activeIdx / totalVisible) * totalVisible;
  const visibleWords = WORDS.slice(startIdx, startIdx + totalVisible);
  const lines: string[][] = [];
  for (let l = 0; l < maxLines; l++) {
    const chunk = visibleWords.slice(l * wordsPerLine, (l + 1) * wordsPerLine);
    if (chunk.length) lines.push(chunk);
  }

  const activeInVisible = activeIdx % totalVisible;

  const animName =
    style.animationPreset === "pop"
      ? "cp-pop"
      : style.animationPreset === "fade"
        ? "cp-fade"
        : style.animationPreset === "slide"
          ? "cp-slide"
          : "none";

  // Use a modest fixed font size that fits the card — no canvas scaling needed
  const fontSize = 20;

  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full h-full px-2">
      {lines.map((lineWords, li) => (
        <div key={li} className="flex flex-wrap justify-center gap-1">
          {lineWords.map((word, wi) => {
            const flatIdx = li * wordsPerLine + wi;
            const isActive = flatIdx === activeInVisible;

            const display =
              style.textTransform === "uppercase"
                ? word.toUpperCase()
                : style.textTransform === "lowercase"
                  ? word.toLowerCase()
                  : style.textTransform === "capitalize"
                    ? word
                        .split(" ")
                        .map(
                          (w) =>
                            w.charAt(0).toUpperCase() +
                            w.slice(1).toLowerCase(),
                        )
                        .join(" ")
                    : word;

            const color = isActive ? style.highlightColor : style.textColor;
            const strokeColor = isActive
              ? style.highlightStrokeColor
              : style.strokeColor;
            const hasPill =
              isActive && style.popBackgroundColor !== "transparent";

            return (
              <span
                key={`${startIdx}-${li}-${wi}`}
                style={{
                  display: "inline-block",
                  fontFamily: style.fontFamily,
                  fontSize: `${fontSize}px`,
                  fontWeight: style.fontWeight,
                  color,
                  letterSpacing:
                    style.letterSpacing !== 0
                      ? `${(style.letterSpacing / style.fontSize) * fontSize}px`
                      : undefined,
                  lineHeight: 1.2,
                  WebkitTextStroke:
                    style.strokeWidth > 0
                      ? `${(style.strokeWidth / style.fontSize) * fontSize * 2}px ${strokeColor}`
                      : undefined,
                  textShadow:
                    style.shadowOffsetY > 0
                      ? `0 1px 3px rgba(0,0,0,0.6)`
                      : undefined,
                  backgroundColor: hasPill
                    ? style.popBackgroundColor
                    : undefined,
                  borderRadius: hasPill ? "3px" : undefined,
                  padding: hasPill ? "1px 4px" : undefined,
                  animation:
                    isActive && animName !== "none"
                      ? `${animName} 0.28s ease forwards`
                      : undefined,
                }}
              >
                {display}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── PresetCard ───────────────────────────────────────────────────────────────

interface PresetCardProps {
  name: string;
  style?: CaptionStyle;
  isSelected: boolean;
  isNone?: boolean;
  onClick: () => void;
}

function PresetCard({
  name,
  style,
  isSelected,
  isNone = false,
  onClick,
}: PresetCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex flex-col rounded-xl border-2 overflow-hidden cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring bg-neutral-100",
        isSelected
          ? "border-primary shadow-md shadow-primary/20"
          : "border-border hover:border-foreground/25",
      )}
      style={{ width: 140, minWidth: 140 }}
      aria-pressed={isSelected}
      aria-label={`Caption preset: ${name}`}
    >
      {/* Caption display area */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: 80 }}
      >
        {isNone ? (
          <div className="flex flex-col items-center justify-center gap-1.5">
            <CaptionsOff className="w-6 h-6 text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground/50 font-medium">
              No captions
            </span>
          </div>
        ) : (
          style && <AnimatedCaptionPreview style={style} />
        )}

        {/* Selected check */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center z-10"
          >
            <Check
              className="w-2.5 h-2.5 text-primary-foreground"
              strokeWidth={3}
            />
          </motion.div>
        )}
      </div>

      {/* Label */}
      {/* <div
        className={cn(
          "w-full px-2 py-1.5 text-center text-[11px] font-semibold leading-tight border-t border-border",
          isSelected ? "text-primary" : "text-muted-foreground",
        )}
      >
        {name}
      </div> */}
    </motion.button>
  );
}

// ─── CaptionPresetSelector ────────────────────────────────────────────────────

interface CaptionPresetSelectorProps {
  selectedPresetId: string | null;
  captionsEnabled: boolean;
  onSelectPreset: (id: string) => void;
  onSelectNone: () => void; // add this
}

export function CaptionPresetSelector({
  selectedPresetId,
  captionsEnabled,
  onSelectPreset,
  onSelectNone,
}: CaptionPresetSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {/* None */}
      <PresetCard
        name="None"
        isNone
        isSelected={!captionsEnabled || selectedPresetId === null}
        onClick={onSelectNone} // ← here
      />

      {CAPTION_PRESETS.map((preset) => (
        <PresetCard
          key={preset.id}
          name={preset.name}
          style={preset.style as CaptionStyle}
          isSelected={captionsEnabled && selectedPresetId === preset.id}
          onClick={() => onSelectPreset(preset.id)}
        />
      ))}
    </div>
  );
}
