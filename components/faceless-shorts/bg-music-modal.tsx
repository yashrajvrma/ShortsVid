"use client";

import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Upload, X, Music } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getDicebearUrl } from "@/lib/utils";

interface BgMusicModalProps {
  open: boolean;
  onClose: () => void;
  selectedMusicId: string | null;
  onSelect: (id: string | null) => void;
}

function MusicItem({
  id,
  name,
  audioUrl,
  isSelected,
  onSelect,
  stopSignal,
}: {
  id: string;
  name: string;
  audioUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
  /** Increment this from the parent to force-stop playback */
  stopSignal: number;
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback whenever parent increments stopSignal (modal close)
  useEffect(() => {
    if (stopSignal > 0) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlaying(false);
    }
  }, [stopSignal]);

  // Also stop when component unmounts (tab switch / modal unmount)
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 font-sans font-medium rounded-xl px-3 py-2.5 transition-all duration-150 text-left w-full ${
        isSelected
          ? "bg-secondary text-secondary-foreground border border-primary/30"
          : "hover:bg-muted/60 bg-transparent"
      }`}
    >
      <div
        className="size-10 shrink-0 rounded-xl overflow-hidden border border-border bg-muted cursor-pointer"
        onClick={handlePlay}
      >
        <img src={getDicebearUrl(name)} alt={name} className="size-full" />
      </div>
      <span className="text-sm font-medium truncate flex-1">{name}</span>
      {audioUrl && (
        <button
          type="button"
          onClick={handlePlay}
          className={`size-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              : "bg-muted hover:bg-primary/20"
          }`}
        >
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
        </button>
      )}
    </button>
  );
}

export function BgMusicModal({
  open,
  onClose,
  selectedMusicId,
  onSelect,
}: BgMusicModalProps) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.stocks.getAllBackgroundMusic.queryOptions(),
  );

  // Incrementing this tells every MusicItem to stop playback
  const [stopSignal, setStopSignal] = useState(0);

  const handleClose = () => {
    setStopSignal((s) => s + 1);
    onClose();
  };

  const systemMusic = data?.systemMusic ?? [];
  const userMusic = data?.userMusic ?? [];

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:min-w-2xl p-0 overflow-hidden sm:my-0 my-5">
        <AlertDialogHeader className="px-6 pt-4">
          <div className="flex items-center justify-between w-full">
            <AlertDialogTitle className="text-lg font-medium">
              Choose background music
            </AlertDialogTitle>
            <AlertDialogCancel
              onClick={handleClose}
              className="size-8 p-0 rounded-full border-none shadow-none hover:bg-muted"
            >
              <X className="size-4" />
            </AlertDialogCancel>
          </div>
        </AlertDialogHeader>

        <Tabs defaultValue="templates" className="w-full py-2">
          <div className="px-6">
            <TabsList className="w-full min-h-10">
              <TabsTrigger value="templates" className="flex-1">
                Templates
              </TabsTrigger>
              <TabsTrigger value="uploaded" className="flex-1">
                Uploaded Sounds
              </TabsTrigger>
            </TabsList>
          </div>

          {/* System Music */}
          <TabsContent value="templates" className="mt-0">
            <ScrollArea className="h-[420px] px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  Loading music…
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 gap-1.5">
                  {/* No Sound option */}
                  <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-left font-medium ${
                      selectedMusicId === null
                        ? "bg-secondary text-secondary-foreground border border-primary/30"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="size-8 rounded-xl flex items-center justify-center bg-muted shrink-0">
                      <X className="size-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">No Sound</span>
                  </button>

                  {systemMusic.map((music) => (
                    <MusicItem
                      key={music.id}
                      id={music.id}
                      name={music.name}
                      audioUrl={music.musicUrl ?? undefined}
                      isSelected={selectedMusicId === music.id}
                      onSelect={() => onSelect(music.id)}
                      stopSignal={stopSignal}
                    />
                  ))}

                  {systemMusic.length === 0 && (
                    <div className="col-span-3 py-8 text-center text-muted-foreground text-sm">
                      No system music available
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* User Uploaded Music */}
          <TabsContent value="uploaded" className="mt-0">
            <div className="px-6 py-4 space-y-4">
              <Button variant="outline" className="w-full gap-2">
                {/* TODO : Implement upload flow */}
                <Upload className="size-4" />
                Upload Music
              </Button>
              <ScrollArea className="h-[360px]">
                {userMusic.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                    <Music className="size-8 opacity-30" />
                    <p className="text-sm">No uploaded music yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {userMusic.map((music) => (
                      <MusicItem
                        key={music.id}
                        id={music.id}
                        name={music.name}
                        audioUrl={music.musicUrl ?? undefined}
                        isSelected={selectedMusicId === music.id}
                        onSelect={() => onSelect(music.id)}
                        stopSignal={stopSignal}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
}
