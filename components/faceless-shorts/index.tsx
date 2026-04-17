"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";

import {
  useFacelessForm,
  getIsScriptLanguageMismatch,
} from "@/hooks/use-faceless-form";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

import { LanguageSelector } from "../shorts/language-selector";
import { TopicDuration } from "../shorts/topic-duration";
import { VoiceSelector } from "./voice-selector";
import { BgMusicSelector } from "../shorts/bg-music-selector";
import { VideoStylePicker } from "./video-style-picker";
import { CaptionConfig } from "../shorts/caption-config";
import { MockupPreview } from "./mockup-preview";
import { ScriptSection } from "./script-section";
import type { AppRouter } from "@/trpc/routers/_app";
import Header from "@/components/header";
import { CaptionStyle } from "@/types";
import { toast } from "sonner";

export default function FacelessShorts() {
  const router = useRouter();
  const trpc = useTRPC();
  const form = useFacelessForm();

  const mutationOptions = trpc.videos.generateFacelessVideo.mutationOptions();

  const generateVideoMutation = useMutation({
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Video generation started successfully!");
      form.reset();
      router.push("/app/videos");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Failed to start video generation");
    },
  });

  const { setField, setCaptionField, setGeneratedScript } = form;
  const isScriptLanguageMismatch = getIsScriptLanguageMismatch(form);

  const isPending = generateVideoMutation.isPending;

  const scriptContent = form.generatedScript;
  const isOverLimit = scriptContent.length > 1200;
  const canGenerate =
    !isOverLimit &&
    form.generatedScript.trim().length > 0 &&
    form.selectedVoiceId !== null;

  const handleGenerate = () => {
    if (!canGenerate) {
      if (!form.generatedScript.trim()) {
        toast.error("Please generate or write a script first.");
        return;
      }
      if (!form.selectedVoiceId) {
        toast.error("Please select a voice first.");
        return;
      }
      return;
    }

    const { captionConfig } = form;

    generateVideoMutation.mutate({
      languageCode: form.languageCode,
      topic: form.topic as any,
      duration: form.duration,
      prompt: form.prompt,
      script: form.generatedScript,
      voiceId: form.selectedVoiceId!,
      musicId: form.selectedMusicId,
      videoStyle: form.videoStyle as any,
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
      captionsEnabled: form.captionsEnabled,
    });
  };

  return (
    <div
      className="w-full flex flex-col font-sans"
      style={{ height: "calc(100vh - 3rem)" }}
    >
      <Header>
        <div className="text-base tracking-tight">Create Faceless Shorts</div>
      </Header>

      {/* ── Main card ───────────────────────────────────────────────────── */}
      <Card
        className="flex-1 min-h-0 overflow-hidden p-0"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {/* ── LEFT  65% ─────────────────────────────────────────────────── */}
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
                onTopicChange={(v) => setField("topic", v)}
                onDurationChange={(v) => setField("duration", v)}
              />
              <Separator />

              {/* 3. Script */}
              <ScriptSection
                languageCode={form.languageCode}
                topic={form.topic}
                duration={form.duration}
                prompt={form.prompt}
                generatedScript={form.generatedScript}
                isLanguageMismatch={isScriptLanguageMismatch}
                generatedScriptLanguage={form.generatedScriptLanguage}
                onPromptChange={(v) => setField("prompt", v)}
                onGeneratedScriptChange={setGeneratedScript}
              />
              <Separator />

              {/* 4. Voice */}
              <VoiceSelector
                languageCode={form.languageCode}
                selectedVoiceId={form.selectedVoiceId}
                searchQuery={form.voiceSearchQuery}
                onSearchChange={(v) => setField("voiceSearchQuery", v)}
                onSelect={(id) =>
                  setField(
                    "selectedVoiceId",
                    form.selectedVoiceId === id ? null : id,
                  )
                }
              />
              <Separator />

              {/* 5. Background Music */}
              <BgMusicSelector
                selectedMusicId={form.selectedMusicId}
                onSelect={(id) => setField("selectedMusicId", id)}
              />

              <Separator />

              {/* 6. Video Style */}
              <VideoStylePicker
                selectedStyle={form.videoStyle}
                onSelect={(v) => setField("videoStyle", v)}
              />

              <Separator />

              {/* 7. Caption Config */}
              <CaptionConfig
                config={form.captionConfig}
                captionsEnabled={form.captionsEnabled}
                onCaptionsEnabledChange={(v) => setField("captionsEnabled", v)}
                onChange={setCaptionField}
              />
            </div>
          </ScrollArea>
        </div>

        {/* ── RIGHT  35% ────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col min-h-0 bg-muted/30 sm:w-[35%]">
          {/* Scrollable preview */}
          <div className="flex-1 min-h-0 overflow-auto">
            <MockupPreview form={form} />
          </div>

          {/* Generate button — pinned to bottom */}
          <div className="shrink-0 p-5 border-t border-border bg-card">
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
            {isOverLimit && (
              <p className="text-destructive text-xs text-center mt-2">
                Shorten your script to under 1200 characters to generate.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* ── Mobile generate button ─────────────────────────────────────── */}
      <div className="md:hidden mt-4 shrink-0">
        <Button
          className="w-full h-11 font-semibold gap-2"
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
        {isOverLimit && (
          <p className="text-destructive text-xs text-center mt-2">
            Shorten your script to under 1200 characters to generate.
          </p>
        )}
      </div>
    </div>
  );
}
