"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoVideo {
  src: string;
  label?: string;
  username: string;
  handle: string;
  avatar: string;
  likes: string;
  likesGrowth: string;
  followers: string;
  followersGrowth: string;
}

const DEMO_VIDEOS: DemoVideo[] = [
  {
    src: "/videos/shorts-1.mp4",
    label: "Improve Your English to Speak Like a CEO",
    username: "Health tips",
    handle: "generationbeautytips",
    avatar: "/avatars/1.jpg",
    likes: "+11M",
    likesGrowth: "+22%",
    followers: "+12K",
    followersGrowth: "+32%",
  },
  {
    src: "/videos/shorts-2.mp4",
    label: "If your dad is still alive...",
    username: "Amy Morgans",
    handle: "amymorgans",
    avatar: "/avatars/2.jpg",
    likes: "+5M",
    likesGrowth: "+45%",
    followers: "+18K",
    followersGrowth: "+195%",
  },
  {
    src: "/videos/shorts-3.mp4",
    label: "KNOWING HISTORY MAKES YOU EXTREMELY INTELLIGENT",
    username: "My IQ · Boost Your Brain",
    handle: "myiq.com",
    avatar: "/avatars/3.jpg",
    likes: "+2M",
    likesGrowth: "+3%",
    followers: "+4K",
    followersGrowth: "+19%",
  },
];

function VideoCard({ video, index }: { video: DemoVideo; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const isCenter = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex flex-col flex-shrink-0",
        isCenter ? "z-10" : "z-0",
        index !== 1 && "mt-6",
      )}
    >
      {/* Phone frame */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl flex-shrink-0",
          "ring-1 ring-white/10 shadow-2xl",
          "bg-neutral-900 flex flex-col",
          // mobile: center card wider, side cards narrower
          isCenter
            ? "w-[200px] sm:w-[240px] md:w-[260px]"
            : "w-[150px] sm:w-[210px] md:w-[230px]",
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2 z-10 relative flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-2xl bg-neutral-700 overflow-hidden flex-shrink-0">
              <img
                src={video.avatar}
                alt={video.username}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="text-[11px] font-semibold text-white leading-tight line-clamp-1">
              {video.username}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-semibold text-emerald-400 tracking-wide uppercase">
              Active
            </span>
          </div>
        </div>

        {/* Video */}
        <div className="relative aspect-[9/16] mx-2 rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
            loop
            autoPlay
            preload="auto"
          >
            <source src={video.src} type="video/mp4" />
          </video>

          {/* Bottom fade overlay */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Mute button */}
          <motion.button
            onClick={toggleMute}
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors focus-visible:outline-none hover:cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {muted ? (
                <motion.span
                  key="muted"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  <VolumeX className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="unmuted"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Stats — inside the frame, below video */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex flex-col items-start">
            <span className="text-xs tracking-tighter font-semibold uppercase text-neutral-500">
              Likes
            </span>
            <div className="flex items-center gap-x-1">
              <span className="text-lg sm:text-xl font-bold text-white">
                {video.likes}
              </span>
              <span className="text-xs p-0.5 bg-green-950 rounded-sm font-semibold text-emerald-400">
                {video.likesGrowth}
              </span>
            </div>
          </div>
          <div className="h-5 w-px bg-neutral-700" />
          <div className="flex flex-col items-start">
            <span className="text-xs tracking-tighter uppercase text-neutral-500">
              Followers
            </span>
            <div className="flex items-center gap-x-1">
              <span className="text-lg sm:text-xl font-bold text-white">
                {video.followers}
              </span>
              <span className="text-xs p-0.5 bg-green-950 rounded-sm font-semibold text-emerald-400">
                {video.followersGrowth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ViewsShowcase() {
  return (
    <div className="flex justify-center">
      <section className="relative overflow-hidden bg-neutral-950 w-full my-20 sm:max-w-4xl max-w-[340px] rounded-3xl border border-neutral-800">
        {/* Big background text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 sm:top-10 top-6 flex items-start justify-center overflow-hidden select-none"
        >
          <span className="text-[clamp(3.5rem,14vw,10rem)] font-semibold leading-none tracking-tighter text-neutral-800">
            +1B VIEWS
          </span>
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-5 text-center mt-14 sm:mt-36 px-4"
        >
          <p className="text-2xl sm:text-4xl font-medium text-neutral-100 font-sans tracking-tighter">
            with videos created{" "}
            <em
              className="font-serif italic text-white not-italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              with ShortsVid
            </em>
          </p>
        </motion.div>

        {/* Videos */}
        <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 md:gap-6 px-4 pb-10">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-neutral-950 to-transparent z-20" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-neutral-950 to-transparent z-20" />

          {DEMO_VIDEOS.map((video, index) => (
            <VideoCard key={index} video={video} index={index} />
          ))}

          {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/70 to-transparent z-20" /> */}
        </div>
      </section>
    </div>
  );
}
