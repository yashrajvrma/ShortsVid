"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VIDEOS = Array.from({ length: 7 }, (_, i) => ({
  src: `https://cdn.shortsvid.pro/videos/video_${i + 1}.webm`,
  poster: `/images/video_${i + 1}.webp`,
  alt: `ShortsVid short video example ${i + 1}`,
}));

const TRACK = [...VIDEOS, ...VIDEOS];

function VideoCard({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <div
      className="relative flex-shrink-0 w-[140px] sm:w-[220px] rounded-2xl overflow-hidden border border-border/60 bg-neutral-900 shadow-md cursor-pointer"
      style={{ aspectRatio: "9/16" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />

      {/* Mute / unmute button — visible on hover */}
      {hovered && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

export function VideoShowcase() {
  return (
    <div className="relative w-full overflow-hidden mt-10 sm:mt-14 max-w-6xl mx-auto">
      {/* Left edge fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-20 z-10 bg-gradient-to-r from-background to-transparent" />
      {/* Right edge fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-20 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="flex gap-3 sm:gap-4 w-max animate-video-marquee pb-4">
        {TRACK.map((video, i) => (
          <VideoCard key={i} src={video.src} poster={video.poster} alt={video.alt} />
        ))}
      </div>

      <style>{`
        @keyframes video-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-video-marquee {
          animation: video-marquee 80s linear infinite;
        }
        .animate-video-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
