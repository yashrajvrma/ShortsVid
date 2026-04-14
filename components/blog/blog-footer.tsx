"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/public/shortsvid-icon.png";

export function BlogFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 pb-20 max-w-3xl mx-auto space-y-8"
    >
      {/* CTA Card */}
      <div className="rounded-2xl border border-border bg-muted/40 flex flex-col items-center text-center gap-4 py-10 px-6">
        <Image
          src={logo}
          alt="ShortsVid logo"
          width={28}
          height={28}
          className="w-12 h-12 object-contain -rotate-5"
        />

        <p className="text-lg font-medium text-foreground max-w-md leading-snug">
          ShortsVid is the best tool to automate viral shorts for TikTok and
          YouTube Shorts
        </p>
        <Button asChild size="lg" className="rounded-xl px-6 font-medium">
          <Link href="/app">Try for free</Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Back link */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>
      </div>
    </motion.div>
  );
}
