"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateDialogue } from "@/actions/conversation-videos/generate-dialogue";
import { Loader2, Sparkles, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import type { DialogueLine } from "@/hooks/use-conversation-form";
import { Topic } from "@prisma/client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface DialogueScriptSectionProps {
  languageCode: string;
  topic: Topic;
  duration: number;
  prompt: string;
  dialogue: DialogueLine[];
  speaker1AvatarId?: string | null;
  speaker2AvatarId?: string | null;
  onPromptChange: (v: string) => void;
  onGeneratedDialogue: (
    lines: Omit<DialogueLine, "id">[],
    language: string,
  ) => void;
  onAddLine: (speaker?: 1 | 2) => void;
  onUpdateLine: (id: string, patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemoveLine: (id: string) => void;
}

type Avatar = {
  id: string;
  name: string;
  avatarUrl: string;
  mimeType: string | null;
};

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
        className="size-8 object-cover rounded-full"
      />
    );
  }

  return (
    <img
      src={avatar.avatarUrl}
      alt={avatar.name}
      className="size-12 object-contain rounded-full bg-muted border border-border"
    />
  );
}

function SpeakerToggle({
  speaker,
  speakerName,
  avatar,
  onChange,
}: {
  speaker: 1 | 2;
  speakerName: string;
  avatar: Avatar | null;
  onChange: (s: 1 | 2) => void;
}) {
  return (
    <div
      onClick={() => onChange(speaker === 1 ? 2 : 1)}
      className="flex shrink-0 flex-col items-center justify-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
      title={`Click to switch speaker. Current: ${speakerName}`}
    >
      {avatar ? (
        <AvatarMedia avatar={avatar} />
      ) : (
        <div className="size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-semibold">
          S{speaker}
        </div>
      )}
      {/* <span className="text-[10px] text-muted-foreground max-w-12 truncate text-center">
        {speakerName}
      </span> */}
    </div>
  );
}

function DialogueLineRow({
  line,
  speaker1Avatar,
  speaker2Avatar,
  onUpdate,
  onRemove,
}: {
  line: DialogueLine;
  speaker1Avatar: Avatar | null;
  speaker2Avatar: Avatar | null;
  onUpdate: (patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemove: () => void;
}) {
  const isSpeaker2 = line.speaker === 2;
  const currentAvatar = isSpeaker2 ? speaker2Avatar : speaker1Avatar;
  const speakerName = currentAvatar
    ? currentAvatar.name
    : `Speaker ${line.speaker}`;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
        isSpeaker2 ? "flex-row-reverse" : "flex-row bg-muted"
      }`}
    >
      {/* Speaker Toggle (Avatar) */}
      <div className="">
        <SpeakerToggle
          speaker={line.speaker}
          speakerName={speakerName}
          avatar={currentAvatar}
          onChange={(s) => onUpdate({ speaker: s })}
        />
      </div>

      {/* Text input */}
      <Textarea
        value={line.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder={`${speakerName} says…`}
        className="flex-1 resize-none min-h-[48px] text-sm py-2 bg-background border-border shadow-sm"
        rows={2}
      />
      {/* Delete */}
      <button
        type="button"
        onClick={onRemove}
        className="size-7 mt-1.5 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

export function DialogueScriptSection({
  languageCode,
  topic,
  duration,
  prompt,
  dialogue,
  speaker1AvatarId,
  speaker2AvatarId,
  onPromptChange,
  onGeneratedDialogue,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
}: DialogueScriptSectionProps) {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stocks.getSystemAiAvatars.queryOptions());
  const avatars = (data?.avatars ?? []) as Avatar[];

  const speaker1Avatar = avatars.find((a) => a.id === speaker1AvatarId) ?? null;
  const speaker2Avatar = avatars.find((a) => a.id === speaker2AvatarId) ?? null;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    if (!prompt.trim()) {
      toast.error("Prompt is required to generate a dialogue.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await generateDialogue({
          languageCode,
          topic,
          duration,
          prompt,
          speaker1Name: speaker1Avatar?.name,
          speaker2Name: speaker2Avatar?.name,
        } as any);

        if (result.success) {
          toast.success("Dialogue generated successfully!");
          onGeneratedDialogue(result.lines, result.languageCode);
        } else {
          toast.error(result.error || "Failed to generate dialogue");
          setError(result.error || "Failed to generate dialogue");
        }
      } catch {
        toast.error("Failed to generate dialogue. Please try again.");
        setError("Failed to generate dialogue. Please try again.");
      }
    });
  };

  const totalChars = dialogue.reduce((acc, l) => acc + l.text.length, 0);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Script (Dialogue)
      </label>

      <Tabs defaultValue="generate" className="py-2">
        <TabsList className="w-full min-h-10">
          <TabsTrigger value="generate" className="flex-1">
            Generate with AI
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">
            Write manually
          </TabsTrigger>
        </TabsList>

        {/* ── Generate tab ── */}
        <TabsContent value="generate" className="space-y-3 mt-3">
          <Textarea
            placeholder="Describe what the two speakers should talk about… e.g. 'A funny argument between two friends about pineapple on pizza'"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="resize-none min-h-[80px] text-sm"
            rows={3}
          />

          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                Generate Dialogue
              </>
            )}
          </Button>

          {error && <p className="text-destructive text-xs">{error}</p>}

          {/* Generated dialogue editor */}
          {dialogue.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {dialogue.length} lines · {totalChars} chars
                </p>
              </div>
              <DialogueEditor
                dialogue={dialogue}
                speaker1Avatar={speaker1Avatar}
                speaker2Avatar={speaker2Avatar}
                onUpdate={onUpdateLine}
                onRemove={onRemoveLine}
                onAdd={onAddLine}
              />
            </div>
          )}
        </TabsContent>

        {/* ── Manual tab ── */}
        <TabsContent value="manual" className="space-y-3 mt-3">
          {dialogue.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 rounded-lg border border-dashed border-border text-center">
              <Users className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No dialogue lines yet. Add your first line below.
              </p>
            </div>
          ) : (
            <DialogueEditor
              dialogue={dialogue}
              speaker1Avatar={speaker1Avatar}
              speaker2Avatar={speaker2Avatar}
              onUpdate={onUpdateLine}
              onRemove={onRemoveLine}
              onAdd={onAddLine}
            />
          )}

          {dialogue.length === 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onAddLine(1)}
              >
                <Plus className="size-4" />
                Add {speaker1Avatar?.name ?? "Speaker 1"} Line
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onAddLine(2)}
              >
                <Plus className="size-4" />
                Add {speaker2Avatar?.name ?? "Speaker 2"} Line
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DialogueEditor({
  dialogue,
  speaker1Avatar,
  speaker2Avatar,
  onUpdate,
  onRemove,
  onAdd,
}: {
  dialogue: DialogueLine[];
  speaker1Avatar: Avatar | null;
  speaker2Avatar: Avatar | null;
  onUpdate: (id: string, patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemove: (id: string) => void;
  onAdd: (speaker?: 1 | 2) => void;
}) {
  const lastSpeaker =
    dialogue.length > 0 ? dialogue[dialogue.length - 1].speaker : 1;
  const nextSpeaker: 1 | 2 = lastSpeaker === 1 ? 2 : 1;

  const nextSpeakerName =
    nextSpeaker === 1
      ? (speaker1Avatar?.name ?? "Speaker 1")
      : (speaker2Avatar?.name ?? "Speaker 2");

  return (
    <div className="space-y-2 border rounded-xl p-1">
      <ScrollArea className="[&>div>div[style]]:!block h-[500px] rounded-lg pr-1">
        <div className="space-y-2 p-1">
          {dialogue.map((line) => (
            <DialogueLineRow
              key={line.id}
              line={line}
              speaker1Avatar={speaker1Avatar}
              speaker2Avatar={speaker2Avatar}
              onUpdate={(patch) => onUpdate(line.id, patch)}
              onRemove={() => onRemove(line.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 text-sm"
        onClick={() => onAdd(nextSpeaker)}
      >
        <Plus className="size-4" />
        Add Line ({nextSpeakerName})
      </Button>
    </div>
  );
}
