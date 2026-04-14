"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogCTA() {
  return (
    <div className="sticky top-22">
      <div className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col gap-4 hover:shadow-md transition-all">
        <h3 className="text-lg font-semibold text-foreground leading-snug">
          Create Viral AI Shorts
        </h3>

        <p className="text-sm text-muted-foreground">
          No editing required. Generate faceless videos in minutes using
          ShortsVid.
        </p>

        <Button asChild size="default" className="rounded-lg font-medium">
          <Link href="/app">Start Creating for Free</Link>
        </Button>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2 pt-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-background border ">
            AI Story Video
          </span>
          <span className="px-2 py-1 rounded-md bg-background border">
            Reddit Video
          </span>
          <span className="px-2 py-1 rounded-md bg-background border">
            Fake Texts
          </span>
          <span className="px-2 py-1 rounded-md bg-background border">
            Dialogue Video
          </span>
        </div>
      </div>
    </div>
  );
}
