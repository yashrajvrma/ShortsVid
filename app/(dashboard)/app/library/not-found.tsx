"use client";

import { motion } from "framer-motion";
import { Film, ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VideoNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.4,
            type: "spring",
            bounce: 0.4,
          }}
          className="relative"
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card shadow-lg">
            <Film
              className="h-10 w-10 text-muted-foreground"
              strokeWidth={1.5}
            />
            {/* Strikethrough diagonal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-px w-16 rotate-45 bg-destructive/60" />
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">Video not found</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            This video doesn't exist, was deleted, or failed to generate. It may
            also belong to a different account.
          </p>
        </motion.div>

        {/* Error code pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-mono text-muted-foreground"
        >
          404 · Video not found
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex w-full flex-col gap-3 sm:flex-row"
        >
          <Button asChild className="flex-1 gap-2">
            <Link href="/app/shorts/faceless-shorts">
              <Plus className="h-4 w-4" />
              Create New Video
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 gap-2">
            <Link href="/app">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          >
            <Link href="/app/library">
              <Search className="h-3.5 w-3.5" />
              Browse all your videos
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
