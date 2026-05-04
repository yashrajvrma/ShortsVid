"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialsColumn } from "../testimonial-columns";

const testimonials = [
  {
    text: "I went from 0 to 47K followers in 6 weeks using ShortsVid. I just paste my blog posts and it turns them into viral-ready Shorts. My content output went from 2 videos/week to 20+.",
    image: "https://randomuser.me/api/portraits/men/32.webp",
    name: "Marcus Delgado",
    role: "Digital Creator • 47K followers",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "As a solo founder, I have no time to sit and edit. ShortsVid generates my weekly content in under 10 minutes. The captions sync perfectly and the AI voiceover sounds surprisingly natural.",
    image: "https://randomuser.me/api/portraits/women/44.webp",
    name: "Priya Nair",
    role: "SaaS Founder & Bootstrapper",
    platform: "TikTok",
    stars: 5,
  },
  {
    text: "We use ShortsVid for our agency clients across 5 niches. The batch generation feature saves us literally 30+ hours a month. ROI was clear in the first billing cycle.",
    image: "https://randomuser.me/api/portraits/men/55.webp",
    name: "James Okafor",
    role: "Social Media Agency Owner",
    platform: "Instagram",
    stars: 5,
  },
  {
    text: "The video quality and pacing are on point. I tested 3 other AI video tools before landing here. ShortsVid is the only one that didn't make my audience cringe at the cuts.",
    image: "https://randomuser.me/api/portraits/women/22.webp",
    name: "Sofia Marchetti",
    role: "Lifestyle & Travel Creator",
    platform: "TikTok",
    stars: 5,
  },
  {
    text: "I repurpose my podcast episodes into Shorts every week. My episode about stoicism got 2.1M views after ShortsVid clipped the best 60 seconds. Game changer for discoverability.",
    image: "https://randomuser.me/api/portraits/men/13.webp",
    name: "Daniel Reeves",
    role: "Podcast Host • The Mind Room",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "The script-to-video pipeline is insane. I type a topic, and in 4 minutes I have a complete Short with voiceover, captions, and stock footage. My productivity tripled overnight.",
    image: "https://randomuser.me/api/portraits/women/67.webp",
    name: "Amara Osei",
    role: "Finance Content Creator",
    platform: "YouTube",
    stars: 5,
  },
  {
    text: "I was skeptical about AI-generated videos but ShortsVid proved me wrong. The auto-caption styling and font options actually match my brand. Viewers can't tell the difference.",
    image: "https://randomuser.me/api/portraits/men/78.webp",
    name: "Ryan Kowalski",
    role: "Fitness Influencer • 120K subs",
    platform: "Instagram",
    stars: 5,
  },
  {
    text: "Running an e-commerce brand, I needed product Shorts fast. ShortsVid lets me generate 10 product videos in the time it used to take me to make one. Sales from Shorts are up 34%.",
    image: "https://randomuser.me/api/portraits/women/89.webp",
    name: "Layla Hassan",
    role: "E-commerce Brand Owner",
    platform: "TikTok",
    stars: 5,
  },
  {
    text: "The multilingual voiceover support is what sold me. I create content in English and Spanish simultaneously for my audience. No other tool does this as seamlessly as ShortsVid.",
    image: "https://randomuser.me/api/portraits/men/91.webp",
    name: "Carlos Mendoza",
    role: "Bilingual Content Strategist",
    platform: "YouTube",
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
          <motion.div
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
          </motion.div>
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
