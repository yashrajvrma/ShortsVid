"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
  platform?: string;
  stars?: number;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(
                ({ text, image, name, role, platform, stars = 5 }, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:shadow-primary/10 transition-shadow duration-300 max-w-xs w-full"
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: stars }).map((_, s) => (
                        <Star
                          key={s}
                          className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {text}
                    </p>

                    {/* Divider */}
                    <div className="my-4 h-px bg-border" />

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <img
                        width={38}
                        height={38}
                        src={image}
                        alt={name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm tracking-tight leading-tight truncate">
                          {name}
                        </span>
                        <span className="text-xs leading-tight text-muted-foreground truncate">
                          {role}
                        </span>
                      </div>
                      {platform && (
                        <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-400 text-background shrink-0">
                          {platform}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
