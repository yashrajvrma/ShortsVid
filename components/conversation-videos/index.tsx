"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CaptionStyle } from "@/types";

import { useConversationForm } from "@/hooks/use-conversation-form";
import { useRouter } from "next/navigation";

import { LanguageSelector } from "../shorts/language-selector";
import { TopicDuration } from "../shorts/topic-duration";
import { BgMusicSelector } from "../shorts/bg-music-selector";
import { CaptionConfig } from "../shorts/caption-config";
import Header from "@/components/header";

import { DialogueScriptSection } from "./dialogue-script-section";
import { SpeakerAvatarSelector } from "./speaker-avatar-selector";
import { BackgroundVideoSelector } from "./background-video-selector";
import { SpeakerVoiceSelector } from "./speaker-voice-selector";
import { ConversationMockupPreview } from "./conversation-mockup-preview";
import { Topic } from "@prisma/client";

export default function ConversationVideos() {
  const router = useRouter();
  const trpc = useTRPC();
  const form = useConversationForm();
  const [showConfirm, setShowConfirm] = useState(false);

  const mutationOptions =
    trpc.videos.generateConversationVideo.mutationOptions();

  const generateVideoMutation = useMutation({
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Conversation video generation started!");
      form.reset();
      router.push("/app/library");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(
        error.message || "Failed to start conversation video generation",
      );
    },
  });

  const isPending = generateVideoMutation.isPending;

  const {
    setField,
    setCaptionField,
    setGeneratedDialogue,
    addDialogueLine,
    updateDialogueLine,
    removeDialogueLine,
  } = form;

  // ── Validation ────────────────────────────────────────────────────────────
  const hasDialogue = form.dialogue.length > 0;
  const hasAllText = form.dialogue.every((l) => l.text.trim().length > 0);
  const canGenerate =
    hasDialogue &&
    hasAllText &&
    form.speaker1VoiceId !== null &&
    form.speaker2VoiceId !== null &&
    form.backgroundVideoId !== null;

  const handleGenerate = () => {
    if (!canGenerate) {
      if (!hasDialogue || !hasAllText) {
        toast.error("Please generate or write a dialogue script first.");
        return;
      }
      if (!form.speaker1VoiceId || !form.speaker2VoiceId) {
        toast.error("Please select voices for both speakers.");
        return;
      }
      if (!form.backgroundVideoId) {
        toast.error("Please select a background video.");
        return;
      }
      return;
    }

    setShowConfirm(true);
  };

  const onConfirmGenerate = () => {
    setShowConfirm(false);

    const { captionConfig } = form;

    generateVideoMutation.mutate({
      languageCode: form.languageCode,
      topic: form.topic as any,
      duration: form.duration,
      prompt: form.prompt,
      script: form.dialogue.map((d) => d.text),
      speaker1AvatarId: form.speaker1AvatarId!,
      speaker2AvatarId: form.speaker2AvatarId!,
      voice1Id: form.speaker1VoiceId!,
      voice2Id: form.speaker2VoiceId!,
      backgroundVideoId: form.backgroundVideoId!,
      backgroundMusicId: form.selectedMusicId,
      captionsEnabled: form.captionsEnabled,
      captionConfig: {
        // ── Colors ──────────────────────────────────────────────────────
        textColor: captionConfig.textColor,
        strokeColor: captionConfig.strokeColor,
        highlightColor: captionConfig.highlightColor,
        // @ts-ignore
        highlightStrokeColor: captionConfig.highlightStrokeColor,
        popBackgroundColor: captionConfig.popBackgroundColor,
        // ── Effects ─────────────────────────────────────────────────────
        strokeWidth: captionConfig.strokeWidth,
        fontSize: captionConfig.fontSize,
        verticalPosition: captionConfig.verticalPosition,
        horizontalPosition: captionConfig.horizontalPosition,
        maxLines: captionConfig.maxLines,
        maxWordsPerLine: captionConfig.maxWordsPerLine,
        shadowOffsetY: captionConfig.shadowOffsetY,
        shadowBlur: captionConfig.shadowBlur,
        // ── Typography ───────────────────────────────────────────────────
        fontFamily: captionConfig.fontFamily,
        fontWeight: captionConfig.fontWeight,
        textTransform: captionConfig.textTransform,
        letterSpacing: captionConfig.letterSpacing,
        // ── Animation ───────────────────────────────────────────────────
        animationPreset: captionConfig.animationPreset,
        // ── Light leak ───────────────────────────────────────────────────
        lightLeakHue: captionConfig.lightLeakHue,
        lightLeakSeed: captionConfig.lightLeakSeed,
      } satisfies CaptionStyle,
    });
  };

  const GenerateButton = (
    <Button
      className="w-full h-11 font-semibold gap-2 text-sm"
      disabled={isPending || !canGenerate}
      onClick={handleGenerate}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <Zap className="size-4" />
          Generate Video
        </>
      )}
    </Button>
  );

  return (
    <div
      className="w-full flex flex-col font-sans"
      style={{ height: "calc(100vh - 3rem)" }}
    >
      <Header>
        <div className="text-base tracking-tight">
          Create Conversation Videos
        </div>
      </Header>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      <Card
        className="flex-1 min-h-0 overflow-hidden p-0"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {/* ── LEFT 65% ──────────────────────────────────────────────────── */}
        <div className="flex flex-col min-h-0 border-r border-border lg:w-[65%] w-full min-w-0 overflow-hidden">
          <ScrollArea className="[&>div>div[style]]:!block flex-1 min-h-0 h-full overflow-y-auto overflow-x-hidden">
            <div className="sm:p-6 p-4 space-y-4 min-w-0 overflow-hidden w-full">
              {/* 1. Language */}
              <LanguageSelector
                value={form.languageCode}
                onChange={(v) => setField("languageCode", v)}
              />

              {/* 2. Topic + Duration */}
              <TopicDuration
                topic={form.topic}
                duration={form.duration}
                onTopicChange={(v: Topic) => setField("topic", v)}
                onDurationChange={(v) => setField("duration", v)}
              />

              <Separator />

              {/* 3. Dialogue Script */}
              <DialogueScriptSection
                languageCode={form.languageCode}
                topic={form.topic}
                duration={form.duration}
                prompt={form.prompt}
                dialogue={form.dialogue}
                speaker1AvatarId={form.speaker1AvatarId}
                speaker2AvatarId={form.speaker2AvatarId}
                onPromptChange={(v) => setField("prompt", v)}
                onGeneratedDialogue={(lines, lang) =>
                  setGeneratedDialogue(lines, lang)
                }
                onAddLine={addDialogueLine}
                onUpdateLine={updateDialogueLine}
                onRemoveLine={removeDialogueLine}
              />

              <Separator />

              {/* 4. Speaker Avatars */}
              <SpeakerAvatarSelector
                speaker1AvatarId={form.speaker1AvatarId}
                speaker2AvatarId={form.speaker2AvatarId}
                onSelectSpeaker1={(id) => setField("speaker1AvatarId", id)}
                onSelectSpeaker2={(id) => setField("speaker2AvatarId", id)}
              />

              <Separator />

              {/* 5. Background Video */}
              <BackgroundVideoSelector
                selectedVideoId={form.backgroundVideoId}
                onSelect={(id) => setField("backgroundVideoId", id)}
              />

              <Separator />

              {/* 6. Speaker Voices */}
              <SpeakerVoiceSelector
                languageCode={form.languageCode}
                speaker1VoiceId={form.speaker1VoiceId}
                speaker2VoiceId={form.speaker2VoiceId}
                // voiceSearchQuery={form.voiceSearchQuery}
                // onVoiceSearchChange={(v) => setField("voiceSearchQuery", v)}
                onSelectSpeaker1Voice={(id) => setField("speaker1VoiceId", id)}
                onSelectSpeaker2Voice={(id) => setField("speaker2VoiceId", id)}
              />

              <Separator />

              {/* 7. Background Music */}
              <BgMusicSelector
                selectedMusicId={form.selectedMusicId}
                onSelect={(id) => setField("selectedMusicId", id)}
              />

              <Separator />

              {/* 8. Caption Config */}
              <CaptionConfig
                config={form.captionConfig}
                captionsEnabled={form.captionsEnabled}
                onCaptionsEnabledChange={(v) => setField("captionsEnabled", v)}
                onChange={setCaptionField}
              />
            </div>
          </ScrollArea>
        </div>

        {/* ── RIGHT 35% ─────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col min-h-0 bg-muted/30 sm:w-[35%]">
          {/* Scrollable preview */}
          <div className="flex-1 min-h-0 overflow-auto">
            <ConversationMockupPreview form={form} />
          </div>

          {/* Generate button — pinned to bottom */}
          <div className="shrink-0 p-5 border-t border-border bg-card">
            {GenerateButton}
            {!canGenerate && (
              <p className="text-muted-foreground text-xs text-center mt-2">
                Complete dialogue, avatars, videos, and voices to generate.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* ── Mobile generate button ─────────────────────────────────────── */}
      <div className="md:hidden mt-4 shrink-0">{GenerateButton}</div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Conversation Video</AlertDialogTitle>
            <AlertDialogDescription>
              Generating this video will consume <strong>5 credits</strong>. Are
              you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmGenerate}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
