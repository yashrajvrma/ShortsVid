"use client";

import { motion } from "framer-motion";
import { TestimonialsColumn } from "../testimonial-columns";

const testimonials = [
  {
    text: "I type a topic, hit generate, and 5 minutes later I have a complete Short — script, voiceover, captions and stock visuals all done. I went from posting twice a week to posting daily.",
    image: "/images/testimonials/avatar_3.webp",
    name: "Marcus Delgado",
    role: "YouTube Creator • 47K subscribers",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "The video style picker is insane. I switch between cinematic and anime depending on the topic and both look premium. My audience literally asked me which editor I hired.",
    image: "/images/testimonials/avatar_4.webp",
    name: "Priya Nair",
    role: "Lifestyle Creator • TikTok",
    platform: "TikTok",
    stars: 5,
  },
  {
    text: "The auto-captions are the best I've seen from any AI tool. TikTok Yellow style, perfectly synced, never a word wrong. This alone saves me an hour per video.",
    image: "/images/testimonials/avatar_6.webp",
    name: "James Okafor",
    role: "Faceless Content Creator",
    platform: "Instagram",
    stars: 5,
  },
  {
    text: "I never wanted to record my own voice. The AI voice library is huge and they sound natural. I previewed 10 voices and found the perfect one for my niche in minutes.",
    image: "/images/testimonials/avatar_7.webp",
    name: "Sofia Marchetti",
    role: "Finance Shorts Creator",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "The AI avatar feature is what made me switch. Full faceless videos with a presenter that looks real. My history channel blew up because the avatar fits the cinematic style perfectly.",
    image: "/images/testimonials/avatar_8.webp",
    name: "Daniel Reeves",
    role: "History & Facts Creator",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "I create content for Hindi and English audiences. ShortsVid generates the same video in both languages with native-sounding voiceovers. Doubled my reach without any extra effort.",
    image: "/images/testimonials/hnn7qjbeka98bkikpdokprbp7qq.webp",
    name: "Pinank",
    role: "Bilingual Creator • Reels",

    platform: "Instagram",
    stars: 5,
  },
  {
    text: "The background music library is curated perfectly. I pick a mood, it gives me tracks that fit the vibe of the script. My watch time went up noticeably after I started using it.",
    image: "/images/testimonials/jsjjeoeoeoc.webp",
    name: "Amara Osei",
    role: "Motivational Shorts Creator",
    platform: "TikTok",
    stars: 5,
  },
  {
    text: "The stock footage AI picks is spot-on. I used to spend 20 minutes finding B-roll for every scene. Now it's automatic and the visuals match the script better than I ever did manually.",
    image: "/images/testimonials/2idjdjwkexnxsleke.webp",
    name: "Ryan Kowalski",
    role: "Educational Content Creator",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "I manage content for 3 client brands. ShortsVid lets me generate 15 shorts a week across all of them. The preview before download means zero back-and-forth with clients.",
    image: "/images/testimonials/1690466258472.webp",
    name: "Layla Hassan",
    role: "Social Media Agency Owner",
    platform: "TikTok",
    stars: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center mx-auto"
        >
          {/* Badge */}
          {/* <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 text-primary text-sm font-medium py-1 px-4 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Stories
            </div>
          </div> */}

          <h2 className="text-3xl sm:text-5xl font-medium tracking-tighter text-center mt-2">
            Hear what creators say about us
          </h2>

          <p className="text-center mt-2 text-muted-foreground text-lg leading-relaxed">
            See what our users have to say about ShortsVid.
          </p>

          {/* Social proof numbers */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mt-6"
          >
            {[
              { value: "12K+", label: "Active creators" },
              { value: "4.9★", label: "Average rating" },
              { value: "10K+", label: "Shorts generated" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-foreground">
                  {value}
                </span>
                <span className="sm:text-sm text-xs text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Scrolling testimonial columns */}
        <div className="flex justify-center gap-5 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[760px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={22}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={16}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
