"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useVoiceAvatar } from "@/hooks/voice/use-voice-avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SpeakerAvatarSelectorProps {
  speaker1AvatarId: string | null;
  speaker2AvatarId: string | null;
  onSelectSpeaker1: (id: string) => void;
  onSelectSpeaker2: (id: string) => void;
}

function AvatarThumbnail({ slug, label }: { slug: string; label: string }) {
  const avatarSvg = useVoiceAvatar(slug);
  return (
    <div
      className="size-full"
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
}

function AvatarGrid({
  avatars,
  selectedId,
  onSelect,
}: {
  avatars: { id: string; slug: string; label: string; thumbnail: string | null }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollArea className="[&>div>div[style]]:!block h-[180px] rounded-lg border border-border bg-muted/20">
      <div className="grid grid-cols-3 gap-2 p-2">
        {avatars.map((avatar) => {
          const isSelected = selectedId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                isSelected
                  ? "border-primary shadow-md scale-[1.03]"
                  : "border-transparent hover:border-border"
              }`}
            >
              {avatar.thumbnail ? (
                <img
                  src={avatar.thumbnail}
                  alt={avatar.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden">
                  <AvatarThumbnail slug={avatar.slug} label={avatar.label} />
                </div>
              )}

              {/* Label overlay */}
              <div
                className={`absolute inset-x-0 bottom-0 px-1 py-0.5 text-[9px] font-semibold text-white leading-tight text-center truncate transition-opacity ${
                  isSelected
                    ? "bg-black/60"
                    : "bg-black/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {avatar.label}
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="size-3.5 text-primary drop-shadow-md" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function SpeakerAvatarSelector({
  speaker1AvatarId,
  speaker2AvatarId,
  onSelectSpeaker1,
  onSelectSpeaker2,
}: SpeakerAvatarSelectorProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.stocks.getAiAvatars.queryOptions());
  const avatars = data?.avatars ?? [];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Speaker Avatars</label>

      <div className="grid grid-cols-2 gap-3">
        {/* Speaker 1 */}
        <Card className="p-3 gap-2.5 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs px-2 py-0.5 rounded-md">
              Speaker 1
            </Badge>
            {speaker1AvatarId && (
              <span className="text-xs text-muted-foreground truncate">
                {avatars.find((a) => a.id === speaker1AvatarId)?.label ?? ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground rounded-lg border border-border bg-muted/20">
              Loading…
            </div>
          ) : (
            <AvatarGrid
              avatars={avatars}
              selectedId={speaker1AvatarId}
              onSelect={onSelectSpeaker1}
            />
          )}
        </Card>

        {/* Speaker 2 */}
        <Card className="p-3 gap-2.5 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
              Speaker 2
            </Badge>
            {speaker2AvatarId && (
              <span className="text-xs text-muted-foreground truncate">
                {avatars.find((a) => a.id === speaker2AvatarId)?.label ?? ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground rounded-lg border border-border bg-muted/20">
              Loading…
            </div>
          ) : (
            <AvatarGrid
              avatars={avatars}
              selectedId={speaker2AvatarId}
              onSelect={onSelectSpeaker2}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
