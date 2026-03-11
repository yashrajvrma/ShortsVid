"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Video, Zap } from "lucide-react";

import { useFacelessForm } from "@/hooks/use-faceless-form";
import { generateVideo } from "@/app/(dashboard)/app/shorts/faceless-shorts/actions";

import { LanguageSelector } from "./language-selector";
import { TopicDuration } from "./topic-duration";
import { ScriptSection } from "./script-section";
import { VoiceSelector } from "./voice-selector";
import { BgMusicSelector } from "./bg-music-selector";
import { VideoStylePicker } from "./video-style-picker";
import { CaptionConfig } from "./caption-config";
import { MockupPreview } from "./mockup-preview";

export default function FacelessShorts() {
  const {
    form,
    setField,
    setCaptionField,
    setGeneratedScript,
    isScriptLanguageMismatch,
  } = useFacelessForm();

  const [isPending, startTransition] = useTransition();

  const scriptContent = form.generatedScript;
  const isOverLimit = scriptContent.length > 1000;

  const canGenerate = !isOverLimit;

  const handleGenerate = () => {
    if (!canGenerate) return;
    startTransition(async () => {
      await generateVideo({
        languageCode: form.languageCode,
        topic: form.topic,
        duration: form.duration,
        script: form.generatedScript,
        voiceId: form.selectedVoiceId,
        musicId: form.selectedMusicId,
        videoStyle: form.videoStyle,
        captionConfig: form.captionConfig,
      });
    });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Page header */}
      <div className="mb-5 flex items-center gap-3 shrink-0">
        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Create Faceless Shorts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate AI-powered short videos in minutes
          </p>
        </div>
      </div>

      {/* Main card — fixed viewport height so inner ScrollArea works */}
      <Card
        className="flex flex-col md:flex-row overflow-hidden shadow-md border border-border"
        style={{ height: "calc(100vh - 9rem)" }}
      >
        {/* ─── Left — Content (60%) ──────────────────────────────────────────── */}
        <div className="flex-1 md:w-[60%] md:max-w-[60%] min-h-0 flex flex-col overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-7">
              {/* 1. Language */}
              <LanguageSelector
                value={form.languageCode}
                onChange={(v) => setField("languageCode", v)}
              />

              <Separator />

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

              {/* Background Music */}
              <BgMusicSelector
                selectedMusicId={form.selectedMusicId}
                onSelect={(id) => setField("selectedMusicId", id)}
              />

              <Separator />

              {/* 5. Video Style */}
              <VideoStylePicker
                selectedStyle={form.videoStyle}
                onSelect={(v) => setField("videoStyle", v)}
              />

              <Separator />

              {/* 6. Caption Config */}
              <CaptionConfig
                config={form.captionConfig}
                onChange={setCaptionField}
              />
            </div>
          </ScrollArea>
        </div>

        {/* ─── Right — Mockup Preview (40%) — desktop only ──────────────────── */}
        <div className="hidden md:flex md:w-[40%] md:max-w-[40%] border-l border-border bg-muted/30 flex-col">
          <div className="flex-1 overflow-auto">
            <MockupPreview form={form} />
          </div>

          {/* Generate button pinned to bottom of right panel */}
          <div className="p-5 border-t border-border bg-card">
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
                Shorten your script to under 1000 characters to generate.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Mobile — Generate button (visible on small screens) */}
      <div className="md:hidden mt-4">
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
      </div>
    </div>
  );
}
