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
      <div className="flex justify-center mx-auto sm:px-3 px-2 mb-5">
        {/* <a
          href="https://peerlist.io/yashrajvrma/project/shortsvid"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://peerlist.io/api/v1/projects/embed/PRJHEOGAALQ8OMQOLHOEJB6AGKJLD8?showUpvote=true&theme=light"
            alt="ShortsVid"
            className="sm:h-16 h-12"
            // style={"width: auto; height: 72px;"}
            style={{
              width: "auto",
              // height: "72px",
            }}
          />
        </a> */}

        <a
          href="https://www.producthunt.com/products/shortsvid?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-shortsvid"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="ShortsVid - Get ready to post viral shorts in seconds | Product Hunt"
            // width="250"
            // height="54"
            className="sm:h-14 h-12 rounded-xl"
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1118712&amp;theme=dark&amp;t=1775738243009"
          />
        </a>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl sm:text-6xl tracking-tighter font-semibold leading-[1.05] max-w-2xl mx-auto"
      >
        <div>Automate viral tiktok</div> <div>shorts in seconds</div>
        {/* <div>&#35; 1 AI shorts</div>
        <div>generator</div> */}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="mt-4 text-lg sm:text-xl font-normal text-muted-foreground max-w-xl mx-auto leading-relaxed"
      >
        Script Visuals Voiceover Captions &mdash; all done by AI.
        <p>No editing skills required!</p>
      </motion.p>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <Button
          size="lg"
          className="text-lg font-serif tracking-tight mt-8 rounded-xl border-2 font-medium px-8 h-14 sm:w-60 w-50 border-red-300 border-double hover:cursor-pointer"
          onClick={() => {
            router.push("/app");
          }}
        >
          Start Creating
          <MoveRight className="ml-2 w-8 h-8" />
        </Button>

        <div className="pt-1 text-lg font-medium">3-days Free trial</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-2 my-3"
      >
        <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
        <span className="tracking-tight font-medium">
          Loved by 100K+ creators
        </span>
      </motion.div>

      {/* videos */}
      <VideoShowcase />
    </section>
  );
}
