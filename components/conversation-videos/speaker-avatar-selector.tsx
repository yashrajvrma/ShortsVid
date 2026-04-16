"use client";

import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SpeakerAvatarSelectorProps {
  speaker1AvatarId: string | null;
  speaker2AvatarId: string | null;
  onSelectSpeaker1: (id: string) => void;
  onSelectSpeaker2: (id: string) => void;
}

type Avatar = {
  id: string;
  name: string;
  mimeType: string | null;
  avatarUrl: string;
};

// ── Avatar media — renders img or video depending on mimeType ────────────────
function AvatarMedia({ avatar }: { avatar: Avatar }) {
  const isVideo = avatar.mimeType?.startsWith("video/") ?? false;

  if (isVideo) {
    return (
      <video
        src={avatar.avatarUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <img
      src={avatar.avatarUrl}
      alt={avatar.name}
      className="w-full h-full object-contain"
    />
  );
}

// ── Single avatar card ────────────────────────────────────────────────────────
function AvatarCard({
  avatar,
  isSelected,
  onSelect,
}: {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative aspect-square rounded-lg overflow-hidden border transition-all p-2 ${
        isSelected
          ? "border-secondary shadow-md scale-[1.04]"
          : "border-border hover:scale-[1.04]"
      }`}
    >
      <AvatarMedia avatar={avatar} />
      {/* Label overlay */}
      {/* <div
        className={`absolute inset-x-0 bottom-0 px-1 py-0.5 text-[9px] font-semibold text-white leading-tight text-center truncate transition-opacity ${
          isSelected
            ? "bg-black/60"
            : "bg-black/40 opacity-0 group-hover:opacity-100"
        }`}
      >
        {avatar.name}
      </div> */}
      {/* Selected checkmark */}
      {isSelected && (
        // <div className="absolute bottom-1 right-1">
        //   <CheckCircle2 className="size-5 text-secondary drop-shadow-md" />
        // </div>
        <div className="absolute top-1 right-1 size-4 rounded-full bg-secondary flex items-center justify-center">
          <svg
            viewBox="0 0 12 12"
            className="size-2.5 text-secondary-foreground"
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
  );
}

// ── Avatar grid panel (per speaker) ──────────────────────────────────────────
function AvatarPanel({
  label,
  speakerNum,
  avatars,
  isLoading,
  selectedId,
  onSelect,
}: {
  label: string;
  speakerNum: 1 | 2;
  avatars: Avatar[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selectedName = avatars.find((a) => a.id === selectedId)?.name ?? null;

  return (
    <Card className="flex-1 p-3 gap-3 min-w-0 mt-4">
      <div className="flex justify-between gap-2 min-w-0">
        {/* <Badge
          variant={speakerNum === 1 ? "default" : "secondary"}
          className="text-xs px-2 py-0.5 rounded-md shrink-0"
        >
          {label}
        </Badge> */}
        <div className="text-sm px-2 py-0.5 rounded-md shrink-0">{label}</div>
        {selectedName && (
          <span className="text-sm text-primary truncate">{selectedName}</span>
        )}
      </div>

      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground rounded-lg border border-border bg-muted/20">
          Loading…
        </div>
      ) : avatars.length === 0 ? (
        <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground rounded-lg border border-border bg-muted/20">
          <User className="size-6 opacity-30" />
          No avatars found
        </div>
      ) : (
        <ScrollArea className="[&>div>div[style]]:!block h-[400px] rounded-lg border border-border bg-muted/10">
          <div className="grid grid-cols-3 gap-2 p-2">
            {avatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                isSelected={selectedId === avatar.id}
                onSelect={() => onSelect(avatar.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function SpeakerAvatarSelector({
  speaker1AvatarId,
  speaker2AvatarId,
  onSelectSpeaker1,
  onSelectSpeaker2,
}: SpeakerAvatarSelectorProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.stocks.getSystemAiAvatars.queryOptions(),
  );
  const avatars = (data?.avatars ?? []) as Avatar[];

  // ── Auto-select random avatars on first load ──────────────────────────────
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (hasAutoSelected.current) return;
    if (!avatars || avatars.length < 2) return;
    if (speaker1AvatarId && speaker2AvatarId) return; // already chosen

    hasAutoSelected.current = true;

    const spongebob1 = avatars.find(
      (a) => a.name.toLowerCase() === "spongebob 1",
    );
    const peterGriffin2 = avatars.find(
      (a) => a.name.toLowerCase() === "peter griffin 2",
    );

    if (!speaker1AvatarId) {
      if (peterGriffin2) {
        onSelectSpeaker1(peterGriffin2.id);
      } else {
        const idx1 = Math.floor(Math.random() * avatars.length);
        onSelectSpeaker1(avatars[idx1].id);
      }
    }

    if (!speaker2AvatarId) {
      if (spongebob1) {
        onSelectSpeaker2(spongebob1.id);
      } else {
        const idx2 = Math.floor(Math.random() * avatars.length);
        onSelectSpeaker2(avatars[idx2].id);
      }
    }
  }, [
    avatars,
    speaker1AvatarId,
    speaker2AvatarId,
    onSelectSpeaker1,
    onSelectSpeaker2,
  ]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Speaker Avatars
      </label>

      <div className="flex gap-3">
        <AvatarPanel
          label="Speaker 1"
          speakerNum={1}
          avatars={avatars}
          isLoading={isLoading}
          selectedId={speaker1AvatarId}
          onSelect={onSelectSpeaker1}
        />
        <AvatarPanel
          label="Speaker 2"
          speakerNum={2}
          avatars={avatars}
          isLoading={isLoading}
          selectedId={speaker2AvatarId}
          onSelect={onSelectSpeaker2}
        />
      </div>
    </div>
  );
}
