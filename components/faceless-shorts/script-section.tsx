"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateScript } from "@/app/(dashboard)/app/shorts/faceless-shorts/actions";
import { AlertTriangle, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { LANGUAGES } from "@/lib/constants";

const MAX_CHARS = 1000;

interface ScriptSectionProps {
  languageCode: string;
  topic: string;
  duration: number;
  prompt: string;
  generatedScript: string;
  isLanguageMismatch: boolean;
  generatedScriptLanguage: string;
  onPromptChange: (value: string) => void;
  onGeneratedScriptChange: (script: string) => void;
}

export function ScriptSection({
  languageCode,
  topic,
  duration,
  prompt,
  generatedScript,
  isLanguageMismatch,
  generatedScriptLanguage,
  onPromptChange,
  onGeneratedScriptChange,
}: ScriptSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await generateScript({
          languageCode,
          topic,
          duration,
          prompt: prompt || undefined,
        });
        if (result.success) {
          onGeneratedScriptChange(result.script);
        }
      } catch (e) {
        setError("Failed to generate script. Please try again.");
      }
    });
  };

  const scriptContent = generatedScript;
  const charCount = scriptContent.length;
  const isOverLimit = charCount > MAX_CHARS;

  const mismatchLang = LANGUAGES.find((l) => l.code === generatedScriptLanguage);
  const newLang = LANGUAGES.find((l) => l.code === languageCode);

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        3. Script
      </label>

      <Tabs defaultValue="generate">
        <TabsList className="w-full">
          <TabsTrigger value="generate" className="flex-1">
            <WandSparkles className="size-3.5 mr-1.5" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">
            Manual
          </TabsTrigger>
        </TabsList>

        {/* Generate tab */}
        <TabsContent value="generate" className="space-y-3 mt-3">
          <Textarea
            placeholder="Describe what you want your video to be about... (optional)"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="resize-none min-h-[80px] text-sm"
            maxLength={MAX_CHARS}
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
                Generate Script
              </>
            )}
          </Button>

          {error && (
            <p className="text-destructive text-xs">{error}</p>
          )}

          {generatedScript && (
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  value={generatedScript}
                  onChange={(e) => onGeneratedScriptChange(e.target.value)}
                  className={`resize-none min-h-[140px] text-sm ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  rows={6}
                />
                <span
                  className={`absolute bottom-2 right-3 text-xs ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              {isOverLimit && (
                <p className="text-destructive text-xs">
                  Script exceeds {MAX_CHARS} characters. Please shorten it.
                </p>
              )}
              {isLanguageMismatch && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2.5">
                  <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Your script was generated in{" "}
                    <strong>{mismatchLang?.name ?? generatedScriptLanguage}</strong>{" "}
                    but you&apos;ve switched to{" "}
                    <strong>{newLang?.name ?? languageCode}</strong>. Consider
                    regenerating the script.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Manual tab */}
        <TabsContent value="manual" className="space-y-2 mt-3">
          <div className="relative">
            <Textarea
              placeholder="Write your script here..."
              value={generatedScript}
              onChange={(e) => onGeneratedScriptChange(e.target.value)}
              className={`resize-none min-h-[180px] text-sm ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
              rows={8}
              maxLength={MAX_CHARS + 100}
            />
            <span
              className={`absolute bottom-2 right-3 text-xs ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          {isOverLimit && (
            <p className="text-destructive text-xs">
              Script exceeds {MAX_CHARS} characters. Shorten to proceed.
            </p>
          )}
          {isLanguageMismatch && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2.5">
              <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Your script seems to be in{" "}
                <strong>{mismatchLang?.name ?? generatedScriptLanguage}</strong>{" "}
                but you&apos;ve selected{" "}
                <strong>{newLang?.name ?? languageCode}</strong>. Please update
                accordingly.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
