"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Import your screenshots here
import scriptImg from "@/public/images/ai-script.png";
import videoStyleImg from "@/public/images/video-style.png";
import captionsImg from "@/public/images/captions.png";
import voiceImg from "@/public/images/voices.png";
import exportImg from "@/public/images/export.png";
import gameplayImg from "@/public/images/gameplay-shorts.png";

const FEATURES = [
  {
    img: scriptImg,
    title: "AI Script Generation",
    desc: "Just type your idea and let AI write a viral-ready script in seconds. No copywriting skills needed.",
  },
  {
    img: videoStyleImg,
    title: "Choose Video Style",
    desc: "Pick from cinematic, anime, cartoon and more. Every style is AI-generated and looks stunning.",
  },
  {
    img: captionsImg,
    title: "Captions & Subtitles",
    desc: "Auto-generated captions with multiple styles — TikTok Yellow, Neon Glow, Comic Bold and more.",
  },
  {
    img: voiceImg,
    title: "AI Voice Selection",
    desc: "Choose from a library of AI voices. Search, preview and pick the perfect voice for your short.",
  },
  {
    img: exportImg,
    title: "Preview & Download",
    desc: "Preview your finished short before downloading. Export in full HD, ready to post anywhere.",
  },
  {
    img: gameplayImg,
    title: "Gameplay Videos",
    desc: "Turn gameplay footage into engaging shorts with auto captions, voiceover and highlights.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProductFeatures() {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-foreground">
            Create viral videos in few clicks
          </h2>
          <p className="mt-3 text-base sm:text-2xl text-muted-foreground tracking-tight">
            No Need of switching tools and manual editing.
          </p>
          <p className="text-base sm:text-2xl text-muted-foreground tracking-tight">
            ShortsVid gives you everything you need to create viral shorts with
            AI.{" "}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              // @ts-ignore
              variants={cardVariants}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-3 hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:cursor-pointer"
            >
              {/* Screenshot container */}
              <div className="relative w-full overflow-hidden rounded-xl bg-muted aspect-video">
                <Image
                  src={feature.img}
                  alt={feature.title}
                  // quality={1200}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Subtle top fade so screenshot blends into card */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/30" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1 px-1 pb-1">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
