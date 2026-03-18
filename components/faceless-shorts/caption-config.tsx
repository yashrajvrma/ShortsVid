"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Type, Palette, Sliders, Zap } from "lucide-react";

import { FONT_FAMILIES } from "../remotion/fonts";
import { Button } from "../ui/button";
import { CaptionStyle } from "@/types";
import { CAPTION_PRESETS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CaptionConfigProps {
  config: CaptionStyle;
  captionsEnabled: boolean;
  onCaptionsEnabledChange: (enabled: boolean) => void;
  onChange: <K extends keyof CaptionStyle>(
    key: K,
    value: CaptionStyle[K],
  ) => void;
}

// ─── Color Field ──────────────────────────────────────────────────────────────

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isTransparent = value === "transparent";
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={isTransparent ? "#000000" : value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <div
          className="w-12 h-7 rounded-md border border-border shadow-sm cursor-pointer hover:scale-105 transition-transform overflow-hidden"
          style={{
            backgroundColor: isTransparent ? "transparent" : value,
            backgroundImage: isTransparent
              ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)"
              : "none",
            backgroundSize: "8px 8px",
          }}
        />
      </label>
    </div>
  );
}

// ─── Slider Row ───────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="text-sm text-muted-foreground shrink-0 w-28">
        {label}
      </span>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="flex-1"
      />
      <span className="text-sm font-medium tabular-nums text-foreground w-12 text-right">
        {value}
        {unit}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const NONE_PRESET_ID = "__none__";

export function CaptionConfig({
  config,
  captionsEnabled,
  onCaptionsEnabledChange,
  onChange,
}: CaptionConfigProps) {
  const [selectedPresetId, setSelectedPresetId] =
    useState<string>(NONE_PRESET_ID);

  const fontFamilyOptions = Object.entries(FONT_FAMILIES).map(
    ([key, value]) => ({
      // label: key.replace(/([A-Z])/g, " $1").trim(),
      label:
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim(),
      value,
    }),
  );

  const animationOptions = [
    { value: "pop", label: "Pop", icon: "✦" },
    { value: "fade", label: "Fade", icon: "◎" },
    { value: "slide", label: "Slide", icon: "↑" },
    { value: "none", label: "None", icon: "—" },
  ] as const;

  const transformOptions = [
    { value: "uppercase", label: "AA" },
    { value: "capitalize", label: "Aa" },
    { value: "lowercase", label: "aa" },
    { value: "none", label: "Ab" },
  ] as const;

  const applyPreset = (id: string) => {
    setSelectedPresetId(id);
    if (id === NONE_PRESET_ID) {
      onCaptionsEnabledChange(false);
      return;
    }
    onCaptionsEnabledChange(true);
    const preset = CAPTION_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    (Object.keys(preset.style) as (keyof CaptionStyle)[]).forEach((k) => {
      onChange(k, preset.style[k] as CaptionStyle[typeof k]);
    });
  };

  return (
    <div className="space-y-3">
      {/* Heading */}
      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
        Captions
      </div>

      {/* ── Preset Pills ── */}
      <div>
        {/* <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Style Presets
          </span>
        </div> */}

        <div className="flex flex-wrap gap-2">
          {/* None — turns captions off */}
          <Button
            onClick={() => applyPreset(NONE_PRESET_ID)}
            className={`px-3 py-1.5 text-sm border transition-all duration-200 rouned-lg ${
              !captionsEnabled
                ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            None
          </Button>

          {CAPTION_PRESETS.map((preset) => (
            <TooltipProvider key={preset.id} delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => applyPreset(preset.id)}
                    className={`px-3 py-1.5 text-sm border transition-all duration-200 rouned-lg ${
                      captionsEnabled && selectedPresetId === preset.id
                        ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                        : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                  >
                    {preset.name}
                  </Button>
                </TooltipTrigger>
                {/* <TooltipContent side="top">
                  <p className="text-xs">{preset.description}</p>
                </TooltipContent> */}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── Settings Tabs — dimmed when captions off ── */}
      <div
        className={`transition-opacity duration-200 ${!captionsEnabled ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}
      >
        {/* ── Settings Tabs ── */}
        <Tabs defaultValue="colors" className="py-2">
          <TabsList className="w-full grid grid-cols-4 min-h-10">
            <TabsTrigger value="colors" className="text-xs gap-2">
              <Palette className="size-4" />
              <span className="hidden sm:inline text-sm">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-xs gap-1">
              <Type className="size-4" />
              <span className="hidden sm:inline text-sm">Text</span>
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs gap-1">
              <Sliders className="size-4" />
              <span className="hidden sm:inline text-sm">Effects</span>
            </TabsTrigger>
            <TabsTrigger value="animation" className="text-xs gap-1">
              <Zap className="size-4" />
              <span className="hidden sm:inline text-sm">Animate</span>
            </TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="mt-3">
            <div className="rounded-xl border border-border bg-card px-4 divide-y divide-border">
              <ColorField
                label="Text"
                value={config.textColor}
                onChange={(v) => onChange("textColor", v)}
              />
              <ColorField
                label="Stroke"
                value={config.strokeColor}
                onChange={(v) => onChange("strokeColor", v)}
              />
              <ColorField
                label="Highlight"
                value={config.highlightColor}
                onChange={(v) => onChange("highlightColor", v)}
              />
              <ColorField
                label="Highlight Stroke"
                value={config.highlightStrokeColor}
                onChange={(v) => onChange("highlightStrokeColor", v)}
              />
              <ColorField
                label="Pill Background"
                value={
                  config.popBackgroundColor === "transparent"
                    ? "#6C3CF7"
                    : config.popBackgroundColor
                }
                onChange={(v) => onChange("popBackgroundColor", v)}
              />
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-muted-foreground">
                  Transparent Pill
                </span>
                <Switch
                  checked={config.popBackgroundColor === "transparent"}
                  onCheckedChange={(c) =>
                    onChange(
                      "popBackgroundColor",
                      c ? "transparent" : "#6C3CF7",
                    )
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="mt-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3 space-y-3">
              {/* Font */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0 w-14">
                  Font
                </span>
                <Select
                  value={config.fontFamily}
                  onValueChange={(v) => onChange("fontFamily", v)}
                >
                  <SelectTrigger className="h-8 text-sm flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilyOptions.map((f) => (
                      <SelectItem
                        key={f.value}
                        value={f.value}
                        className="text-sm"
                      >
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0 w-14">
                  Weight
                </span>
                <Select
                  value={config.fontWeight}
                  onValueChange={(v) => onChange("fontWeight", v)}
                >
                  <SelectTrigger className="h-8 text-sm flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { v: "400", l: "Regular" },
                      { v: "500", l: "Medium" },
                      { v: "600", l: "SemiBold" },
                      { v: "700", l: "Bold" },
                      { v: "800", l: "ExtraBold" },
                      { v: "900", l: "Black" },
                    ].map(({ v, l }) => (
                      <SelectItem key={v} value={v} className="text-sm">
                        {l} ({v})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Case */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0 w-14">
                  Case
                </span>
                <div className="flex gap-1.5">
                  {transformOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      onClick={() => onChange("textTransform", opt.value)}
                      className={`px-3 py-1.5 text-sm border transition-all duration-200 rouned-lg ${
                        config.textTransform === opt.value
                          ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                          : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
                      }`}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="divide-y divide-border">
                <SliderRow
                  label="Font Size"
                  value={config.fontSize}
                  min={20}
                  max={150}
                  step={2}
                  onChange={(v) => onChange("fontSize", v)}
                  unit="px"
                />
                <SliderRow
                  label="Letter Spacing"
                  value={config.letterSpacing}
                  min={-10}
                  max={20}
                  onChange={(v) => onChange("letterSpacing", v)}
                />
                <SliderRow
                  label="Max Lines"
                  value={config.maxLines}
                  min={1}
                  max={4}
                  onChange={(v) => onChange("maxLines", v)}
                />
                <SliderRow
                  label="Words / Line"
                  value={config.maxWordsPerLine}
                  min={1}
                  max={12}
                  onChange={(v) => onChange("maxWordsPerLine", v)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Effects */}
          <TabsContent value="effects" className="mt-3">
            <div className="rounded-xl border border-border bg-card px-4 divide-y divide-border">
              <SliderRow
                label="Stroke Width"
                value={config.strokeWidth}
                min={0}
                max={30}
                onChange={(v) => onChange("strokeWidth", v)}
                unit="px"
              />
              <SliderRow
                label="Shadow Offset"
                value={config.shadowOffsetY}
                min={0}
                max={30}
                onChange={(v) => onChange("shadowOffsetY", v)}
                unit="px"
              />
              <SliderRow
                label="Shadow Blur"
                value={config.shadowBlur}
                min={0}
                max={60}
                onChange={(v) => onChange("shadowBlur", v)}
                unit="px"
              />
              <SliderRow
                label="Vertical Pos"
                value={config.verticalPosition}
                min={0}
                max={100}
                onChange={(v) => onChange("verticalPosition", v)}
                unit="%"
              />
              <SliderRow
                label="Horizontal Pos"
                value={config.horizontalPosition}
                min={0}
                max={100}
                onChange={(v) => onChange("horizontalPosition", v)}
                unit="%"
              />
            </div>
          </TabsContent>

          {/* Animation */}
          <TabsContent value="animation" className="mt-3">
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="grid grid-cols-4 gap-2">
                {animationOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    onClick={() => onChange("animationPreset", opt.value)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-1.5 text-sm border transition-all duration-200 rouned-lg ${
                      config.animationPreset === opt.value
                        ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                        : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                  >
                    {/* <span className="text-base leading-none">{opt.icon}</span> */}
                    <span
                    // className={`text-[11px] font-semibold ${config.animationPreset === opt.value ? " text-secondary-foreground shadow-sm hover:text-secondary-foreground" : "text-muted-foreground"}`}
                    >
                      {opt.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
