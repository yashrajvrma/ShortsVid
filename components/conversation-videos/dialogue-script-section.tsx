"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateDialogue } from "@/actions/conversation-videos/generate-dialogue";
import {
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { DialogueLine } from "@/hooks/use-conversation-form";

interface DialogueScriptSectionProps {
  languageCode: string;
  topic: string;
  duration: number;
  prompt: string;
  dialogue: DialogueLine[];
  onPromptChange: (v: string) => void;
  onGeneratedDialogue: (lines: Omit<DialogueLine, "id">[], language: string) => void;
  onAddLine: (speaker?: 1 | 2) => void;
  onUpdateLine: (id: string, patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemoveLine: (id: string) => void;
}

function SpeakerToggle({
  speaker,
  onChange,
}: {
  speaker: 1 | 2;
  onChange: (s: 1 | 2) => void;
}) {
  return (
    <div className="flex shrink-0 rounded-lg overflow-hidden border border-border text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange(1)}
        className={`px-2.5 py-1.5 transition-colors ${
          speaker === 1
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-muted"
        }`}
      >
        S1
      </button>
      <button
        type="button"
        onClick={() => onChange(2)}
        className={`px-2.5 py-1.5 transition-colors ${
          speaker === 2
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-muted"
        }`}
      >
        S2
      </button>
    </div>
  );
}

function DialogueLineRow({
  line,
  onUpdate,
  onRemove,
}: {
  line: DialogueLine;
  onUpdate: (patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg p-2 border transition-colors ${
        line.speaker === 1
          ? "border-primary/20 bg-primary/5"
          : "border-muted-foreground/20 bg-muted/30"
      }`}
    >
      {/* Speaker toggle */}
      <SpeakerToggle
        speaker={line.speaker}
        onChange={(s) => onUpdate({ speaker: s })}
      />

      {/* Text input */}
      <Textarea
        value={line.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder={`Speaker ${line.speaker} says…`}
        className="flex-1 resize-none min-h-[52px] text-sm py-2"
        rows={2}
      />

      {/* Delete */}
      <button
        type="button"
        onClick={onRemove}
        className="size-7 mt-0.5 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
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
  onPromptChange,
  onGeneratedDialogue,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
}: DialogueScriptSectionProps) {
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
        });

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
      <label className="text-sm font-medium text-foreground">Script (Dialogue)</label>

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

          <Button onClick={handleGenerate} disabled={isPending} className="w-full">
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
                Add Speaker 1 Line
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => onAddLine(2)}
              >
                <Plus className="size-4" />
                Add Speaker 2 Line
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
  onUpdate,
  onRemove,
  onAdd,
}: {
  dialogue: DialogueLine[];
  onUpdate: (id: string, patch: Partial<Omit<DialogueLine, "id">>) => void;
  onRemove: (id: string) => void;
  onAdd: (speaker?: 1 | 2) => void;
}) {
  const lastSpeaker = dialogue.length > 0 ? dialogue[dialogue.length - 1].speaker : 1;
  const nextSpeaker: 1 | 2 = lastSpeaker === 1 ? 2 : 1;

  return (
    <div className="space-y-2">
      <ScrollArea className="[&>div>div[style]]:!block max-h-[320px] rounded-lg pr-1">
        <div className="space-y-2 p-1">
          {dialogue.map((line) => (
            <DialogueLineRow
              key={line.id}
              line={line}
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
        Add Line (Speaker {nextSpeaker})
      </Button>
    </div>
  );
}
