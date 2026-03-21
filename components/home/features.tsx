"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic2, Palette, Rocket, FileText, Play } from "lucide-react";

const FEATURES = [
  {
    step: "01",
    icon: FileText,
    title: "Create script with AI",
    description:
      "Describe your topic and let our AI craft a compelling, viral-ready script tailored to your niche and audience in seconds.",
    badge: "Script AI",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200/60",
    demo: (
      <div className="bg-muted/60 rounded-xl p-4 mt-4 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Generating script…</span>
        </div>
        {[
          "Hook: Did you know that…",
          "Fact 1: The human brain…",
          "Fact 2: Scientists found…",
          "CTA: Follow for more!",
        ].map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
            className="text-foreground/80 flex gap-2"
          >
            <span className="text-primary">›</span> {line}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    step: "02",
    icon: Mic2,
    title: "Select voice from 50+",
    description:
      "Choose from over 50 ultra-realistic AI voices across languages, accents, and styles. Your shorts will sound indistinguishable from real creators.",
    badge: "Voice AI",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200/60",
    demo: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { name: "Sarah (US)", lang: "English", active: true },
          { name: "Arjun (IN)", lang: "Hindi", active: false },
          { name: "Lena (DE)", lang: "German", active: false },
          { name: "Marco (IT)", lang: "Italian", active: false },
        ].map((v) => (
          <div
            key={v.name}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs border transition-all ${
              v.active
                ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                : "bg-muted/50 border-border text-muted-foreground"
            }`}
          >
            <Mic2 className="w-3 h-3 flex-shrink-0" />
            <div>
              <div>{v.name}</div>
              <div className="opacity-60 text-[10px]">{v.lang}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "03",
    icon: Palette,
    title: "Choose theme",
    description:
      "Pick from dozens of stunning visual themes — from cinematic to minimalist. Auto-synced captions, transitions, and B-roll included.",
    badge: "Visual AI",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200/60",
    demo: (
      <div className="mt-4 flex gap-2 flex-wrap">
        {[
          {
            name: "Cinematic",
            color: "from-slate-700 to-slate-900",
            active: true,
          },
          {
            name: "Neon",
            color: "from-violet-500 to-fuchsia-500",
            active: false,
          },
          {
            name: "Minimal",
            color: "from-gray-100 to-gray-300",
            active: false,
          },
          {
            name: "Nature",
            color: "from-emerald-400 to-green-600",
            active: false,
          },
          {
            name: "Retro",
            color: "from-amber-400 to-orange-500",
            active: false,
          },
        ].map((theme) => (
          <div
            key={theme.name}
            className={`relative rounded-lg overflow-hidden cursor-pointer ${theme.active ? "ring-2 ring-primary ring-offset-1" : ""}`}
          >
            <div className={`w-12 h-16 bg-gradient-to-b ${theme.color}`} />
            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-[9px] text-white text-center py-0.5">
              {theme.name}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "04",
    icon: Rocket,
    title: "Generate & publish",
    description:
      "Hit generate and get a fully rendered short video ready to publish. Direct export to YouTube Shorts, TikTok, and Instagram Reels.",
    badge: "Auto-Publish",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200/60",
    demo: (
      <div className="mt-4 space-y-3">
        {[
          {
            platform: "YouTube Shorts",
            status: "Published",
            icon: "▶",
            color: "text-red-500",
          },
          {
            platform: "TikTok",
            status: "Scheduled",
            icon: "♫",
            color: "text-foreground",
          },
          {
            platform: "Instagram Reels",
            status: "Uploading…",
            icon: "◈",
            color: "text-pink-500",
          },
        ].map((p) => (
          <div
            key={p.platform}
            className="flex items-center justify-between bg-muted/60 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className={`${p.color} font-bold`}>{p.icon}</span>
              <span className="text-foreground/80 font-medium">
                {p.platform}
              </span>
            </div>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {p.status}
            </Badge>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 bg-background border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            How it works
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl mx-auto mb-4">
            Create better video shorts{" "}
            <em className="not-italic text-primary">with AI</em>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Forget switching between dozens of tools. ShortsVid gives you
            everything you need to create, refine, and launch shorts with AI.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}
              >
                <Card
                  className={`h-full border ${feature.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${feature.bg}`}
                      >
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <span className="text-4xl font-black text-muted-foreground/20 leading-none">
                        {feature.step}
                      </span>
                    </div>

                    <Badge
                      variant="secondary"
                      className={`text-xs mb-3 ${feature.bg} ${feature.color} border-0`}
                    >
                      {feature.badge}
                    </Badge>

                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Interactive demo */}
                    {feature.demo}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground text-base mb-4">
            Ready to go viral on autopilot?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-colors">
              <Play className="w-4 h-4 fill-current" />
              Start Creating Free
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
