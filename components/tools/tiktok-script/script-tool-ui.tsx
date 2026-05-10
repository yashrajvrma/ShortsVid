"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Wand2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useSession } from "@/lib/auth/client";
import { useRouter, usePathname } from "next/navigation";
import AuthModal from "@/components/tools/auth-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TOPICS = [
  { value: "MOTIVATIONAL", label: "Motivational" },
  { value: "HORROR_STORY", label: "Horror Story" },
  { value: "HISTORY_FACTS", label: "History Facts" },
  { value: "PHILOSOPHY", label: "Philosophy" },
  { value: "STORYTELLING", label: "Storytelling" },
  { value: "MYSTERY_STORY", label: "Mystery Story" },
  { value: "LIFE_HACKS", label: "Life Hacks" },
  { value: "ANY_TOPIC", label: "Any Topic" },
];

const DURATIONS = [
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 45, label: "45 seconds" },
  { value: 60, label: "60 seconds" },
  { value: 90, label: "90 seconds" },
  { value: 120, label: "120 seconds" },
];

export default function ScriptToolUi() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: session } = useSession();

  const [topic, setTopic] = useState<string>("MOTIVATIONAL");
  const [duration, setDuration] = useState<number>(60);
  const [prompt, setPrompt] = useState<string>("");
  const [generatedScript, setGeneratedScript] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const mutationOptions = trpc.tools.generate.mutationOptions();

  const generateScriptMutation = useMutation({
    ...mutationOptions,
    onSuccess: (data) => {
      toast.success("Script generated successfully!");
      setGeneratedScript(data.content);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      if (error.data?.code === "PAYMENT_REQUIRED") {
        toast.error("Not enough credits to generate script.");
        router.push("/pricing");
        return;
      }
      if (error.data?.code === "TOO_MANY_REQUESTS") {
        toast.error(error.message);
        setShowAuthModal(true);
        return;
      }
      toast.error(error.message || "Failed to generate script");
    },
  });

  const isPending = generateScriptMutation.isPending;

  const handleGenerate = () => {
    generateScriptMutation.mutate({
      topic: topic as any,
      duration: duration,
      prompt: prompt.trim() === "" ? undefined : prompt.trim(),
    });
  };

  const copyToClipboard = () => {
    if (!generatedScript.length) return;
    const text = generatedScript.join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col font-sans" style={{ height: "550px" }}>
      <Card
        className="flex-1 min-h-0 overflow-hidden p-0"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {/* ── LEFT CONFIG ──────────────────────────────────────────────────── */}
        <div className="flex flex-col min-h-0 border-r border-border lg:w-[45%] w-full min-w-0 overflow-hidden">
          <ScrollArea className="[&>div>div[style]]:!block flex-1 p-6 h-full overflow-y-auto overflow-x-hidden">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Video Topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Target Duration</Label>
                <Select
                  value={duration.toString()}
                  onValueChange={(v) => setDuration(parseInt(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value.toString()}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Prompt</Label>
                <Textarea
                  placeholder="E.g., Make it super controversial, add a hook about making money, talk about the Roman Empire..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="shrink-0 p-5 border-t border-border bg-card">
            <Button
              className="w-full h-11 font-semibold gap-2 text-sm"
              disabled={isPending}
              onClick={handleGenerate}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  Generate Script {session?.user ? "(1 Credit)" : "(Free)"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── RIGHT OUTPUT ─────────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col min-h-0 w-[55%] bg-muted/30">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <h3 className="font-semibold text-sm">Generated Script</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={generatedScript.length === 0}
            >
              {copied ? (
                <Check className="size-4 mr-2" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <ScrollArea className="flex-1 p-6">
            {generatedScript.length > 0 ? (
              <div className="space-y-4 max-h-[400px]">
                {generatedScript.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-foreground/90 leading-relaxed bg-muted/50 p-3 rounded-lg border border-border/50"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2 opacity-60">
                <Wand2 className="size-8 mb-2" />
                <p>Your viral script will appear here</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>

      {/* Mobile Output View */}
      {generatedScript.length > 0 && (
        <div className="lg:hidden mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Generated Script</h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="size-4 mr-2" />
                ) : (
                  <Copy className="size-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="space-y-4">
              {generatedScript.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-foreground/90 text-sm leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </div>
      )}

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        callbackURL={pathname}
      />
    </div>
  );
}
