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
    <section className="relative sm:pt-36 pt-24 pb-20 text-center">
      {/* <div className="flex justify-center border-2 border-double sm:text-sm text-xs mx-auto sm:w-64 w-54 rounded-xl sm:px-3 px-2 py-1.5 mb-5 font-medium">
        <p className="flex items-center">
          Join
          <span className="font-semibold">&nbsp;100K+&nbsp;</span> creators on
          ShortsVid
        </p>
      </div> */}
      <div className="flex justify-center mx-auto sm:px-3 px-2 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center gap-2 my-1"
        >
          <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
          <span className="tracking-tight font-medium text-sm">
            Loved by 103K+ creators
          </span>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-4xl sm:text-6xl tracking-tighter font-semibold leading-[1.05] max-w-2xl mx-auto"
      >
        <div>Automate viral tiktok</div> <div>shorts in seconds</div>
        {/* <div>&#35; 1 AI shorts</div>
        <div>generator</div> */}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="sm:mt-4 mt-3 text-lg sm:text-xl font-normal text-muted-foreground max-w-xl mx-auto sm:leading-relaxed sm:px-14 px-4"
      >
        <p>
          Script Visuals Voiceover Captions &mdash; all done by AI. No editing
          skills required!
        </p>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <Button
          size="lg"
          className="text-lg font-serif tracking-tight mt-6 rounded-xl border-2 font-medium h-12 px-5 border-red-300 border-double hover:cursor-pointer"
          onClick={() => {
            router.push("/app");
          }}
        >
          Get started for free
          {/* <MoveRight className="ml-2 w-8 h-8" /> */}
        </Button>

        <div className="pt-1 sm:text-base text-sm font-medium">
          No credit card required
        </div>
      </motion.div>

      {/* videos */}
      <VideoShowcase />
    </section>
  );
}
