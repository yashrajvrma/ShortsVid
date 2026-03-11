"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BgMusicModal } from "./bg-music-modal";
import { Music2 } from "lucide-react";

interface BgMusicSelectorProps {
  selectedMusicId: string | null;
  onSelect: (id: string | null) => void;
}

export function BgMusicSelector({
  selectedMusicId,
  onSelect,
}: BgMusicSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">
        Background Music
      </label>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-3"
        onClick={() => setOpen(true)}
      >
        <Music2 className="size-4 text-muted-foreground" />
        {selectedMusicId ? (
          <span className="text-foreground">Music selected ✓</span>
        ) : (
          <span className="text-muted-foreground">Choose background music</span>
        )}
      </Button>

      <BgMusicModal
        open={open}
        onClose={() => setOpen(false)}
        selectedMusicId={selectedMusicId}
        onSelect={(id) => {
          onSelect(id);
          setOpen(false);
        }}
      />
    </div>
  );
}
