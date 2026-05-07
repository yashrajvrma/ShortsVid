"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import img1 from "@/public/images/automate_1.webp";
import img2 from "@/public/images/automate_2.webp";
import img3 from "@/public/images/automate_3.webp";
import img4 from "@/public/images/automate_4.webp";
import img5 from "@/public/images/automate_5.webp";
import img6 from "@/public/images/automate_6.webp";

const IMAGES = [img1, img6, img3, img4, img5, img2];

export function AutomateShowcase() {
  return (
    <section className="w-full sm:py-20 py-12 px-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
          Wait, it can really
          <br />
          automate social media channels?
        </h2>
        <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
          Yes! The videos below were 100% created entirely with ShortsVid
          automations — script, visuals, voice &amp; captions.
        </p>
      </motion.div>

      {/* 3 × 2 image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:max-w-5xl mx-auto">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border"
          >
            <Image
              src={src}
              alt={`ShortsVid automate example ${i + 1}`}
              className="w-full h-auto"
              sizes="(max-width: 640px) 33vw, 320px"
              draggable={false}
              quality={100}
              priority
            />
          </div>
        ))}
      </div>
    </section>
  );
}
