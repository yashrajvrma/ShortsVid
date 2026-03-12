"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BgMusicModal } from "./bg-music-modal";
import { Music2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { getDicebearUrl } from "@/lib/utils";

interface BgMusicSelectorProps {
  selectedMusicId: string | null;
  onSelect: (id: string | null) => void;
}

export function BgMusicSelector({
  selectedMusicId,
  onSelect,
}: BgMusicSelectorProps) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();

  const { data } = useQuery(trpc.stocks.getAllBackgroundMusic.queryOptions());

  const selectedMusicName = useMemo(() => {
    if (!selectedMusicId) return null;
    if (!data) return "Loading...";

    const allMusic = [...(data.systemMusic ?? []), ...(data.userMusic ?? [])];
    const found = allMusic.find((m) => m.id === selectedMusicId);
    return found ? found.name : "Music selected";
  }, [selectedMusicId, data]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Background Music
      </label>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start mt-2 h-10"
        onClick={() => setOpen(true)}
      >
        <Music2 className="size-4 text-muted-foreground" />
        {selectedMusicId ? (
          <div className="flex items-center text-foreground gap-x-2">
            <div
              className="size-6 shrink-0 rounded-xl overflow-hidden border border-border bg-muted cursor-pointer"
              // onClick={handlePlay}
            >
              <img
                src={getDicebearUrl(selectedMusicName!)}
                // alt={name}
                className="size-full"
              />
            </div>
            {selectedMusicName}
          </div>
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
