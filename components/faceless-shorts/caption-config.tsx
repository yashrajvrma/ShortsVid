"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CaptionConfigState } from "@/hooks/use-faceless-form";
import { Captions } from "lucide-react";

interface CaptionConfigProps {
  config: CaptionConfigState;
  onChange: <K extends keyof CaptionConfigState>(
    key: K,
    value: CaptionConfigState[K],
  ) => void;
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <div
          className="w-12 h-7 rounded border border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
        />
      </label>
    </div>
  );
}

export function CaptionConfig({ config, onChange }: CaptionConfigProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        {/* <Captions className="size-4" /> */}
        Live Captions
      </label>

      <div className="rounded-xl border border-border bg-card px-4 py-2 space-y-1 divide-y divide-border">
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
          label="Highlight Text"
          value={config.highlightColor}
          onChange={(v) => onChange("highlightColor", v)}
        />
        <ColorField
          label="Background"
          value={config.backgroundColor}
          onChange={(v) => onChange("backgroundColor", v)}
        />

        {/* Stroke Width */}
        <div className="flex items-center justify-between py-3 gap-4">
          <span className="text-sm text-muted-foreground shrink-0">
            Stroke Width
          </span>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="range"
              min={0}
              max={10}
              value={config.strokeWidth}
              onChange={(e) => onChange("strokeWidth", Number(e.target.value))}
              className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
            />
            <span className="text-sm font-medium w-5 text-right">
              {config.strokeWidth}
            </span>
          </div>
        </div>

        {/* Font Size */}
        <div className="flex items-center justify-between py-3 gap-4">
          <span className="text-sm text-muted-foreground shrink-0">
            Font Size
          </span>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="range"
              min={24}
              max={96}
              step={4}
              value={config.fontSize}
              onChange={(e) => onChange("fontSize", Number(e.target.value))}
              className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
            />
            <span className="text-sm font-medium w-7 text-right">
              {config.fontSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
