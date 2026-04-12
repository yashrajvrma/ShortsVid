"use client";

import { motion } from "framer-motion";
import { X, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  {
    title: "Hiring video editors",
    type: "bad",
    icon: <X className="w-4 h-4 text-destructive" />,
    points: [
      "Costs $50–$300 per video with no guarantee of quality",
      "Long turnaround times of 2–5 days per Short",
      "Constant back-and-forth revisions and briefings",
    ],
  },
  {
    title: "Creating videos yourself",
    type: "bad",
    icon: <X className="w-4 h-4 text-destructive" />,
    points: [
      "Hours spent scripting, recording, and editing manually",
      "Requires expensive software like Premiere or Final Cut",
      "Burnout from juggling creation and growing your channel",
    ],
  },
  {
    title: "ShortsVid",
    type: "good",
    icon: <Check className="w-4 h-4 text-emerald-500" />,
    points: [
      "Generate publish-ready Shorts in under 5 minutes",
      "AI handles scripting, voiceover, captions & stock footage",
      "Scale to 30+ videos/week without hiring anyone",
    ],
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-background py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-xl mx-auto mb-12"
        >
          {/* <div className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/5 text-primary text-sm font-medium py-1 px-4 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5" />
            Why ShortsVid
          </div> */}
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tighter">
            Why creators choose us
          </h2>
          <p className="mt-2 text-muted-foreground text-base">
            See how ShortsVid compares to traditional content creation methods.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {options.map(({ title, type, icon, points }, idx) => {
            const isGood = type === "good";
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
                className={cn(
                  "relative rounded-2xl border p-6 flex flex-col gap-4 transition-shadow duration-300 pb-12",
                  isGood
                    ? "border-emerald/40 bg-emerald-500/5 shadow-md shadow-emerald-500/10"
                    : "border-destructive/20 bg-destructive/5 shadow-sm",
                )}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-semibold text-base tracking-tight",
                      isGood ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {title}
                  </span>
                  <span
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full",
                      isGood ? "bg-emerald-500/15" : "bg-destructive/10",
                    )}
                  >
                    {icon}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className={cn(
                    "h-px",
                    isGood ? "bg-emerald-500/20" : "bg-destructive/15",
                  )}
                />

                {/* Points */}
                <ul className="flex flex-col gap-3">
                  {points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0">
                        {isGood ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <X className="w-4 h-4 text-destructive/70" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-relaxed",
                          isGood
                            ? "text-foreground/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* ShortsVid recommended pill */}
                {/* {isGood && (
                  <div className="mt-auto pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Recommended
                    </span>
                  </div>
                )} */}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
