"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sparkles,
  PenLine,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATIONS } from "@/lib/constants";
import { ScriptVersion } from "@/types";

interface ScriptSectionProps {
  title: string;
  onTitleChange: (v: string) => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  script: string;
  onScriptChange: (v: string) => void;
  scriptMode: "generate" | "manual";
  onScriptModeChange: (v: "generate" | "manual") => void;
  duration: string;
  onDurationChange: (v: string) => void;
  scriptVersions: ScriptVersion[];
  currentVersion: number;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function ScriptSection({
  title,
  onTitleChange,
  prompt,
  onPromptChange,
  script,
  onScriptChange,
  scriptMode,
  onScriptModeChange,
  duration,
  onDurationChange,
  scriptVersions,
  currentVersion,
  isGenerating,
  onGenerate,
}: ScriptSectionProps) {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const charCount = script.length;

  return (
    <div className="space-y-5">
      {/* Project Title */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Project Title</Label>
        <Input
          placeholder="Enter project title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Duration
        </Label>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Script Mode Tabs */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Script</Label>
        <Tabs
          value={scriptMode}
          onValueChange={(v) => onScriptModeChange(v as "generate" | "manual")}
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="generate" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Generate with AI
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              Write Manually
            </TabsTrigger>
          </TabsList>

          {/* Generate Mode */}
          <TabsContent value="generate" className="mt-3 space-y-3">
            <Textarea
              placeholder="Describe your video topic... e.g. 'Facts about the universe that will blow your mind'"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              rows={3}
              className="resize-none bg-background"
            />
            <Button
              onClick={onGenerate}
              disabled={!prompt.trim() || !title.trim() || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {scriptVersions.length > 0
                    ? "Regenerate Script"
                    : "Generate Script"}
                  {scriptVersions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      v{currentVersion + 1}
                    </Badge>
                  )}
                </>
              )}
            </Button>

            {/* Generated Script Output */}
            <AnimatePresence>
              {script && scriptMode === "generate" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">
                        Generated Script
                      </Label>
                      {currentVersion > 0 && (
                        <Badge variant="outline" className="text-xs">
                          v{currentVersion}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {scriptVersions.length > 1 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setShowVersionHistory((p) => !p)}
                              >
                                <History className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Version History</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={handleCopy}
                            >
                              {copied ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Script</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Textarea
                    value={script}
                    onChange={(e) => onScriptChange(e.target.value)}
                    rows={6}
                    className="resize-none bg-muted/40 text-sm"
                    placeholder="Your generated script will appear here..."
                  />
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                  </div>

                  {/* Version History Drawer */}
                  <AnimatePresence>
                    {showVersionHistory && scriptVersions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Version History ({scriptVersions.length} versions)
                          </p>
                          {scriptVersions.map((v) => (
                            <div
                              key={v.version}
                              className={cn(
                                "flex items-start justify-between gap-2 rounded-md p-2 cursor-pointer hover:bg-accent/50 transition-colors",
                                v.version === currentVersion && "bg-accent/60",
                              )}
                              onClick={() => onScriptChange(v.content)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0"
                                  >
                                    v{v.version}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      v.generatedAt,
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {v.content.slice(0, 80)}...
                                </p>
                              </div>
                              {v.version === currentVersion && (
                                <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-1" />
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Manual Mode */}
          <TabsContent value="manual" className="mt-3 space-y-2">
            <Textarea
              placeholder="Write your script here..."
              value={script}
              onChange={(e) => onScriptChange(e.target.value)}
              rows={8}
              className="resize-none bg-background text-sm"
            />
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
