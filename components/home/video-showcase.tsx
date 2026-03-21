"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeOff, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoVideo {
  id: number;
  src: string;
}

const DEMO_VIDEOS: DemoVideo[] = [
  {
    id: 1,
    src: "/videos/shorts-1.mp4",
  },
  {
    id: 2,
    src: "/videos/shorts-2.mp4",
  },
  {
    id: 3,
    src: "/videos/shorts-3.mp4",
  },
  // {
  //   id: 4,
  //   src: "/videos/shorts-4.mp4",
  // },
];

function VideoCard({ video, index }: { video: DemoVideo; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-4xl shadow-xl ring-1 ring-white/10 flex-shrink-0",
        video.id !== 2 && "mt-28",
      )}
    >
      <video
        ref={videoRef}
        className="aspect-9/16 w-[160px] sm:w-[300px] object-cover block"
        playsInline
        muted
        loop
        autoPlay
        preload="auto"
      >
        <source src={video.src} type="video/mp4" />
      </video>

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

      {/* Label */}
      {/* {video.label && (
        <div className="absolute bottom-8 left-0 right-0 px-3">
          <span className="inline-block rounded-lg bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {video.label}
          </span>
        </div>
      )} */}

      {/* Mute toggle button */}
      <motion.button
        onClick={toggleMute}
        whileTap={{ scale: 0.85 }}
        className={cn(
          "absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center",
          "rounded-full bg-black/50 backdrop-blur-sm",
          "text-white/80 hover:text-white hover:bg-black/70 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-label={muted ? "Unmute" : "Mute"}
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
              <VolumeOff className="h-3.5 w-3.5" />
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
    </motion.div>
  );
}

export function VideoShowcase() {
  return (
    <div className="flex items-center justify-center gap-4 hover:cursor-pointer mt-12">
      {DEMO_VIDEOS.map((video, index) => (
        <VideoCard key={index} video={video} index={index} />
      ))}
    </div>
  );
}
