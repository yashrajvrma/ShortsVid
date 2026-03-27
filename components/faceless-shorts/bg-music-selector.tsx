"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BgMusicModal } from "./bg-music-modal";
import { Music2, VolumeX } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useVoiceAvatar } from "@/components/voice-avatar/use-voice-avatar";

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

  const selectedMusic = useMemo(() => {
    if (!selectedMusicId) return null;
    if (!data) return null;
    const allMusic = [...(data.systemMusic ?? []), ...(data.userMusic ?? [])];
    return allMusic.find((m) => m.id === selectedMusicId) ?? null;
  }, [selectedMusicId, data]);

  const avatarSvg = useVoiceAvatar(selectedMusic?.name || "default");

  // Three states:
  //   selectedMusicId === undefined  → nothing chosen yet (initial)
  //   selectedMusicId === null       → user explicitly chose "No Sound"
  //   selectedMusicId === string     → a track is selected
  const hasChosen = selectedMusicId !== undefined;
  const noSoundChosen = hasChosen && selectedMusicId === null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Background Music
      </label>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start mt-2 h-10 rounded-lg gap-2"
        onClick={() => setOpen(true)}
      >
        {noSoundChosen ? (
          // User picked "No Sound"
          <>
            <VolumeX className="size-5 text-muted-foreground shrink-0" />
            <span className="text-foreground text-md font-medium">
              No Music
            </span>
          </>
        ) : selectedMusic ? (
          // A real track is selected
          <>
            {/* <Music2 className="size-4 text-muted-foreground shrink-0" /> */}
            <div className="size-6 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
              <div dangerouslySetInnerHTML={{ __html: avatarSvg }} className="size-full flex items-center justify-center [&>svg]:size-full" />
            </div>
            <span className="truncate text-foreground text-sm font-medium">
              {selectedMusic.name}
            </span>
          </>
        ) : (
          // Nothing chosen yet
          <>
            <Music2 className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">
              Choose background music
            </span>
          </>
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
