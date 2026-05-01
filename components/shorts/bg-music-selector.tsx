"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BgMusicModal } from "./bg-music-modal";
import { Music2, VolumeX } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useVoiceAvatar } from "@/hooks/voice/use-voice-avatar";

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
    return data.find((m) => m.id === selectedMusicId) ?? null;
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
      <div
        className="flex border justify-start items-center w-full h-full mt-2 rounded-lg gap-2 px-3 py-2 hover:cursor-pointer"
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
            <div className="relative size-10 shrink-0 rounded-full overflow-hidden bg-muted mt-0.5">
              <div
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
                className="size-full [&>svg]:size-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="text-sm font-medium truncate">
                {selectedMusic.name}
              </span>
              <span className="text-xs overflow-hidden text-ellipsis">
                {selectedMusic.description ?? ""}
              </span>
            </div>
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
      </div>

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
