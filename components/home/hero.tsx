"use client";

import { motion } from "framer-motion";
import { VideoShowcase } from "./video-showcase";

export function Hero() {
  return (
    <section className="relative sm:pt-36 pt-28 pb-8 text-center">
      <div className="flex justify-center border-2 border-double text-sm mx-auto w-64 rounded-xl sm:px-3 px-2 py-1 font-medium mb-3">
        <p className="flex items-center">
          Join
          <span className="font-semibold">&nbsp;100+&nbsp;</span> creators on
          ShortsVid
        </p>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl sm:text-8xl tracking-tighter font-medium text-black leading-[1.05] max-w-2xl mx-auto"
      >
        Run your shorts <span>on autopilot</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="mt-5 text-lg sm:text-xl font-normal text-muted-foreground max-w-xl mx-auto leading-relaxed"
      >
        Create viral shorts for YouTube, TikTok &amp; Instagram in seconds.
        Script, Visuals, Captions, Voiceover &mdash; all done by AI.
      </motion.p>

      {/* videos */}

      <VideoShowcase />
    </section>
  );
}
