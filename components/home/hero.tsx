"use client";

import { motion } from "framer-motion";
import { VideoShowcase } from "./video-showcase";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import img1 from "@/public/images/testimonials/1690466258472.jpg";
import img2 from "@/public/images/testimonials/2idjdjwkexnxsleke.webp";
import img3 from "@/public/images/testimonials/hnn7qjbeka98bkikpdokprbp7qq-314-profile (1).webp";
import img4 from "@/public/images/testimonials/jsjjeoeoeoc.jpg";
import { useRouter } from "next/navigation";

const avatarUrls = [img1, img2, img3, img4];

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative sm:pt-36 pt-28 pb-8 text-center">
      <div className="flex justify-center border-2 border-double sm:text-sm text-xs mx-auto sm:w-64 w-54 rounded-xl sm:px-3 px-2 py-1.5 mb-3 font-medium">
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
        className="text-5xl sm:text-7xl tracking-tighter font-medium leading-[1.05] max-w-2xl mx-auto"
      >
        <div>Run your shorts</div> <div>on autopilot</div>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <Button
          size="lg"
          className="text-lg font-serif tracking-tight mt-7 mb-5 rounded-xl border-2 font-medium px-8 h-14 sm:w-60 w-50 border-red-300 border-double hover:cursor-pointer"
          onClick={() => {
            router.push("/app");
          }}
        >
          Start Creating
          <MoveRight className="ml-2 w-8 h-8" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-2"
      >
        <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
        <span className="tracking-tight font-medium">Loved by 100+ users</span>
      </motion.div>

      {/* videos */}
      <VideoShowcase />
    </section>
  );
}
