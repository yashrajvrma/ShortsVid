"use client";

import { motion } from "framer-motion";
import { VideoShowcase } from "./video-showcase";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import img1 from "@/public/images/testimonials/avatar_3.webp";
import img2 from "@/public/images/testimonials/avatar_4.webp";
import img3 from "@/public/images/testimonials/avatar_6.webp";
import img4 from "@/public/images/testimonials/avatar_8.webp";
import img5 from "@/public/images/testimonials/avatar_7.webp";
import { useRouter } from "next/navigation";
import Image from "next/image";

const avatarUrls = [img1, img2, img5, img3, img4];

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative sm:pt-36 pt-28 pb-20 text-center">
      {/* <div className="flex justify-center border-2 border-double sm:text-sm text-xs mx-auto sm:w-64 w-54 rounded-xl sm:px-3 px-2 py-1.5 mb-5 font-medium">
        <p className="flex items-center">
          Join
          <span className="font-semibold">&nbsp;100K+&nbsp;</span> creators on
          ShortsVid
        </p>
      </div> */}
      <div className="flex justify-center mx-auto sm:px-3 px-2 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3 my-1"
        >
          <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
          <span className="tracking-tight font-medium text-sm">
            Loved by 100K+ creators
          </span>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center text-3xl sm:text-5xl font-serif tracking-tighter font-semibold leading-[1.2] max-w-2xl mx-auto"
      >
        {/* Desktop: 2 lines */}
        <span className="hidden sm:block">Automate viral Faceless shorts</span>
        <span className="hidden sm:block">and earn passive income</span>
        {/* Mobile: 3 lines */}
        <span className="sm:hidden">
          Automate viral Faceless
          <br />
          shorts and earn passive
          <br />
          income
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="sm:mt-4 mt-3 text-base sm:text-xl font-normal text-muted-foreground sm:max-w-2xl max-w-xl mx-auto sm:leading-relaxed sm:px-12 px-10"
      >
        {/* <p>
          Script Visuals Voiceover Captions &mdash; all done by AI. No editing
          skills required!
        </p> */}
        <p>
          The only AI that generates monetizable videos for you automatically,
          even while you sleep.
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
          className="text-lg font-serif tracking-tight mt-6 rounded-xl border-2 font-medium h-12 sm:px-12 px-6 border-red-300 border-double hover:cursor-pointer"
          onClick={() => {
            router.push("/app");
          }}
        >
          <Zap fill="#ffffff" className="w-12 h-12" />
          Create your first video
          {/* <MoveRight className="ml-2 w-8 h-8" /> */}
        </Button>

        {/* <div className="pt-1 sm:text-sm text-xs text-muted-foreground">
          Get your generated video in less than 5 minutes.
        </div> */}
        <div className="pt-1 sm:text-sm text-xs text-muted-foreground font-normal">
          {/* More than <span className="font-medium">10K+</span> shorts have been
          created. */}
          No credit card required
        </div>
      </motion.div>

      <motion.div
        className="mt-10 sm:mt-14 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        <p className="text-xs sm:text-sm font-normal text-muted-foreground uppercase mb-4">
          Supported Platforms
        </p>
        <div className="flex justify-center items-center gap-6 sm:gap-8">
          <Image
            src="/images/social-icons/yt-full.svg"
            alt="YouTube"
            width={120}
            height={40}
            className="w-24 sm:w-32"
            draggable={false}
          />
          <div className="flex items-center gap-1.5">
            <Image
              src="/images/social-icons/ig.svg"
              alt="Instagram"
              width={32}
              height={32}
              className="w-7 sm:w-9"
              draggable={false}
            />
            <Image
              src="/images/social-icons/instagram-text.svg"
              alt="Instagram Text"
              width={100}
              height={30}
              className="w-24 sm:w-28"
              draggable={false}
            />
          </div>
          <Image
            src="/images/social-icons/tik-tok-full.svg"
            alt="TikTok"
            width={100}
            height={40}
            className="w-20 sm:w-28"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* videos */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        // className="text-center text-3xl sm:text-5xl font-serif tracking-tighter font-semibold leading-[1.2] max-w-2xl mx-auto"
      >
        <VideoShowcase />
      </motion.div>
    </section>
  );
}
