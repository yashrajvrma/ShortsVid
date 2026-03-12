"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Video, Zap } from "lucide-react";

import {
  useFacelessForm,
  getIsScriptLanguageMismatch,
} from "@/hooks/use-faceless-form";
// import { generateVideo } from "@/app/(dashboard)/app/shorts/faceless-shorts/actions";

import { LanguageSelector } from "./language-selector";
import { TopicDuration } from "./topic-duration";
import { VoiceSelector } from "./voice-selector";
import { BgMusicSelector } from "./bg-music-selector";
import { VideoStylePicker } from "./video-style-picker";
import { CaptionConfig } from "./caption-config";
import { MockupPreview } from "./mockup-preview";
import { ScriptSection } from "./script-section";

export default function FacelessShorts() {
  const form = useFacelessForm();
  const { setField, setCaptionField, setGeneratedScript } = form;
  const isScriptLanguageMismatch = getIsScriptLanguageMismatch(form);

  const [isPending, startTransition] = useTransition();

  const scriptContent = form.generatedScript;
  const isOverLimit = scriptContent.length > 1000;
  const canGenerate = !isOverLimit;

  const handleGenerate = () => {
    if (!canGenerate) return;
    startTransition(async () => {
      // await generateVideo({
      //   languageCode: form.languageCode,
      //   topic: form.topic,
      //   duration: form.duration,
      //   script: form.generatedScript,
      //   voiceId: form.selectedVoiceId,
      //   musicId: form.selectedMusicId,
      //   videoStyle: form.videoStyle,
      //   captionConfig: form.captionConfig,
      // });
    });
  };

  return (
    <div
      className="w-full flex flex-col"
      style={{ height: "calc(100vh - 2rem)" }}
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-3 shrink-0">
        {/* <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="size-5 text-primary" />
        </div> */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Create Faceless Shorts
          </h1>
          {/* <p className="text-xs text-muted-foreground mt-0.5">
            Generate AI-powered short videos in minutes
          </p> */}
        </div>
      </div>

      {/* ── Main card ───────────────────────────────────────────────────── */}
      {/*
        CRITICAL FIX:
        - Card is a flex ROW container with a fixed height (flex-1 + min-h-0)
        - Left and right columns use explicit style widths so the browser
          never collapses them regardless of content
        - min-h-0 on every flex child prevents overflow blow-out
        - ScrollArea sits inside the left column and does the scrolling
      */}
      <Card
        className="flex-1 min-h-0 overflow-hidden"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {/* ── LEFT  70% ─────────────────────────────────────────────────── */}
        <div
          className="flex flex-col min-h-0 border-r border-border lg:w-[65%] w-full min-w-0"
          // style={{ width: "70%", minWidth: 0 }}
        >
          <ScrollArea className="flex-1 min-h-0 h-full">
            <div className="p-6 space-y-4">
              {/* 1. Language */}
              <LanguageSelector
                value={form.languageCode}
                onChange={(v) => setField("languageCode", v)}
              />

              {/* <Separator /> */}

              {/* 2. Topic + Duration */}
              <TopicDuration
                topic={form.topic}
                duration={form.duration}
                onTopicChange={(v) => setField("topic", v)}
                onDurationChange={(v) => setField("duration", v)}
              />

              {/* <Separator /> */}

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

              {/* <Separator /> */}

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

              {/* <Separator /> */}

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

              {/* <Separator /> */}

              {/* 7. Caption Config */}
              <CaptionConfig
                config={form.captionConfig}
                onChange={setCaptionField}
              />
            </div>
          </ScrollArea>
        </div>

        {/* ── RIGHT  30% ────────────────────────────────────────────────── */}
        <div
          className="hidden md:flex flex-col min-h-0 bg-muted/30 sm:w-[35%]"
          // style={{ width: "30%", minWidth: 0 }}
        >
          {/* Scrollable preview */}
          <div className="flex-1 min-h-0 overflow-auto">
            <MockupPreview form={form} />
          </div>

          {/* Generate button — pinned to bottom */}
          <div className="shrink-0 p-5 border-border bg-card">
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
      </div>
    </div>
  );
}
