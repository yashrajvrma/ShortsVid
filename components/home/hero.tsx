"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, X, Users, Zap } from "lucide-react";

// Mock short video data — replace with real data / API
const DEMO_VIDEOS = [
  {
    id: 1,
    title: "AI History Facts",
    views: "1.2M",
    thumbnail: null,
    color: "from-orange-400 to-rose-500",
  },
  {
    id: 2,
    title: "Finance Tips",
    views: "840K",
    thumbnail: null,
    color: "from-blue-400 to-violet-500",
  },
  {
    id: 3,
    title: "Tech Trends",
    views: "2.1M",
    thumbnail: null,
    color: "from-emerald-400 to-cyan-500",
  },
  {
    id: 4,
    title: "Life Hacks",
    views: "650K",
    thumbnail: null,
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 5,
    title: "Science Facts",
    views: "980K",
    thumbnail: null,
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 6,
    title: "Motivation",
    views: "3.4M",
    thumbnail: null,
    color: "from-purple-400 to-indigo-500",
  },
];

function PhoneVideoCard({
  video,
  onClick,
  delay = 0,
}: {
  video: (typeof DEMO_VIDEOS)[0];
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Phone frame */}
      <div className="relative mx-auto w-[120px] sm:w-[140px] aspect-[9/16] rounded-[20px] overflow-hidden border-2 border-border/60 bg-card shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
        {/* Gradient bg simulating video */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-80`}
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex justify-between items-start">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0.5 bg-black/40 text-white border-0"
            >
              #{video.id}
            </Badge>
          </div>
          <div>
            <p className="text-white text-[10px] font-semibold leading-tight mb-1">
              {video.title}
            </p>
            <p className="text-white/70 text-[9px]">{video.views} views</p>
          </div>
        </div>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-foreground fill-foreground ml-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: (typeof DEMO_VIDEOS)[0] | null;
  onClose: () => void;
}) {
  if (!video) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Phone frame large */}
          <div className="relative w-[260px] sm:w-[300px] aspect-[9/16] rounded-[32px] overflow-hidden border-4 border-border/80 bg-card shadow-2xl">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${video.color}`}
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
              <p className="text-white font-semibold text-lg">{video.title}</p>
              <p className="text-white/70 text-sm">{video.views} views</p>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                AI Generated Short
              </Badge>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Hero() {
  const [activeVideo, setActiveVideo] = useState<
    (typeof DEMO_VIDEOS)[0] | null
  >(null);

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex flex-col items-center overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.929 0.013 255.508 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.929 0.013 255.508 / 0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial fade over grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
          >
            <Users className="w-3.5 h-3.5" />
            Join 100+ creators on ShortsVid
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center tracking-tight text-foreground text-balance max-w-3xl leading-[1.1] mb-6"
        >
          Run your shorts <span className="text-primary">on autopilot</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-lg sm:text-xl text-muted-foreground text-center max-w-xl text-balance mb-10"
        >
          Create viral shorts for YouTube, TikTok & Instagram in seconds.
          Script, Visuals, Captions, Voiceover — all done by AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-16"
        >
          <Button
            size="lg"
            className="font-semibold px-8 h-12 text-base shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2 fill-current" />
            Start for Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="font-semibold px-8 h-12 text-base"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Video grid — 3 top, 3 bottom (hidden on mobile: show only 3) */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Row 1 — always 3 visible */}
          <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
            {DEMO_VIDEOS.slice(0, 3).map((v, i) => (
              <PhoneVideoCard
                key={v.id}
                video={v}
                onClick={() => setActiveVideo(v)}
                delay={0.55 + i * 0.08}
              />
            ))}
          </div>

          {/* Row 2 — hidden on small screens */}
          <div className="hidden sm:flex gap-3 sm:gap-5 justify-center flex-wrap">
            {DEMO_VIDEOS.slice(3, 6).map((v, i) => (
              <PhoneVideoCard
                key={v.id}
                video={v}
                onClick={() => setActiveVideo(v)}
                delay={0.75 + i * 0.08}
              />
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-xs text-muted-foreground/60"
        >
          Click any video to preview
        </motion.p>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
