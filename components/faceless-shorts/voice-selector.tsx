"use client";

import { useState, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Pause, Mic } from "lucide-react";
import Image from "next/image";

interface VoiceSelectorProps {
  languageCode: string;
  selectedVoiceId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
}

// DiceBear glass avatar URL
function getDicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;
}

export function VoiceSelector({
  languageCode,
  selectedVoiceId,
  searchQuery,
  onSearchChange,
  onSelect,
}: VoiceSelectorProps) {
  const trpc = useTRPC();
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading } = useQuery(
    trpc.voices.getSystemVoice.queryOptions({
      languageCode,
      query: debouncedQuery || undefined,
    }),
  );

  const voices = data?.voicesWithSignedUrl ?? [];

  const handlePlay = (id: string, audioUrl: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingId(id);
    audio.onended = () => setPlayingId(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        {/* <Mic className="size-4" /> */}
        Select Voice
      </label>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search voices..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Voice List */}
      <div>
        <ScrollArea className="[&>div>div[style]]:!block h-[200px] rounded-lg border border-border">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-8">
              <div className="text-muted-foreground text-sm">
                Loading voices…
              </div>
            </div>
          ) : voices.length === 0 ? (
            <div className="flex items-center justify-center h-full py-8">
              <div className="text-muted-foreground text-sm">
                No voices found
              </div>
            </div>
          ) : (
            <div className="p-1 space-y-1 w-full">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => onSelect(voice.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 text-left ${
                    selectedVoiceId === voice.id
                      ? "bg-secondary text-secondary-foreground border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative size-11 shrink-0 rounded-full overflow-hidden border border-border bg-muted">
                    <img
                      src={getDicebearUrl(voice.name)}
                      alt={voice.name}
                      className="size-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-md font-medium truncate">{voice.name}</p>
                    {/* {voice.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {voice.description}
                    </p>
                  )} */}
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs capitalize shrink-0"
                  >
                    {voice.gender}
                  </Badge>

                  {/* Play button */}
                  {voice.audioUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(voice.id, voice.audioUrl!);
                      }}
                      className="size-7 rounded-full flex items-center justify-center bg-muted transition-colors shrink-0"
                    >
                      {playingId === voice.id ? (
                        <Pause className="size-3.5 text-primary" />
                      ) : (
                        <Play className="size-3.5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
