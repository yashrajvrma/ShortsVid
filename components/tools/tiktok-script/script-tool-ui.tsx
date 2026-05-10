"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useSession } from "@/lib/auth/client";
import { useRouter, usePathname } from "next/navigation";
import AuthModal from "@/components/tools/auth-modal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TopicDuration } from "@/components/shorts/topic-duration";
import { Topic } from "@prisma/client";

export default function ScriptToolUi() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: session } = useSession();

  const [topic, setTopic] = useState<string>("ANY_TOPIC");
  const [duration, setDuration] = useState<number>(30);
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
    const text = generatedScript.join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col font-sans max-w-3xl mx-auto">
      <Card className="p-6 sm:p-8 space-y-4 overflow-hidden">
        {/* ── Topic & Duration ── */}
        <TopicDuration
          topic={topic}
          duration={duration}
          onTopicChange={(v: Topic) => setTopic(v)}
          onDurationChange={(v) => setDuration(v)}
        />

        {/* ── Prompt Input ── */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Prompt (Optional)</Label>
          <Textarea
            placeholder="POV of a 16 year old content creator"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="h-16 bg-muted/20 rounded-lg placeholder:text-sm"
          />
        </div>

        {/* ── Generate Button ── */}
        <div className="pt-0">
          <Button
            className="w-full h-12 font-medium gap-2 text-sm rounded-lg transition-all"
            disabled={isPending}
            onClick={handleGenerate}
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Generating Script…
              </>
            ) : (
              <>
                <WandSparkles className="size-4" />
                Generate script {session?.user ? "(1 credit)" : ""}
              </>
            )}
          </Button>
        </div>

        {/* ── Output Section ── */}
        {generatedScript.length > 0 && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Your Script</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2 rounded-lg"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-muted/40 border border-border/50 rounded-lg p-6 relative group">
              <p className="text-foreground/90 leading-relaxed text-sm">
                {generatedScript.join(" ")}
              </p>
            </div>
          </div>
        )}
      </Card>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        callbackURL={pathname}
      />
    </div>
  );
}
