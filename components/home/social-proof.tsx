"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const STATS = [
  { value: "+1B", label: "Views generated", sub: "across all platforms" },
  { value: "100K+", label: "Active creators", sub: "and growing daily" },
  { value: "50K+", label: "Shorts created", sub: "with ShortsVid AI" },
  { value: "4.9★", label: "User rating", sub: "loved by creators" },
];

const SAMPLE_CHANNELS = [
  {
    name: "HealthTips",
    views: "+11M",
    growth: "+42k",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Amy Morgans",
    views: "+5M",
    growth: "+18k",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Know History",
    views: "+2M",
    growth: "+4k",
    color: "from-blue-400 to-indigo-500",
  },
];

export function SocialProofSection() {
  return (
    <section className="w-full py-20 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Big stat headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-secondary-foreground/50 mb-4 font-medium">
            Trusted by creators worldwide
          </p>
          <div className="relative inline-block">
            <h2 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-secondary-foreground/10 select-none leading-none">
              +1B VIEWS
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl sm:text-2xl font-semibold text-secondary-foreground">
                with shorts created{" "}
                <em className="not-italic text-primary font-bold">with AI</em>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-4xl font-black text-secondary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-secondary-foreground/80">
                {stat.label}
              </div>
              <div className="text-xs text-secondary-foreground/40 mt-1">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sample channel cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {SAMPLE_CHANNELS.map((channel, i) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full sm:w-auto"
            >
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${channel.color} flex-shrink-0`}
              />
              <div>
                <p className="text-sm font-semibold text-secondary-foreground">
                  {channel.name}
                </p>
                <p className="text-xs text-secondary-foreground/50">
                  {channel.views} total views
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-400 text-sm font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                {channel.growth}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
