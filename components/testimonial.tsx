"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  authorName: string;
  authorPosition: string;
  authorImage?: string;
  highlightedText?: string;
}

export const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  (
    {
      className,
      quote,
      authorName,
      authorPosition,
      authorImage,
      highlightedText,
      ...props
    },
    ref,
  ) => {
    const formattedQuote = highlightedText
      ? quote.replace(
          highlightedText,
          `<strong class="font-semibold text-primary">${highlightedText}</strong>`,
        )
      : quote;

    return (
      <div ref={ref} className={cn("py-16", className)} {...props}>
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Decorative quote mark */}
            <div className="mb-6 text-primary/20 select-none" aria-hidden>
              <svg
                width="48"
                height="36"
                viewBox="0 0 48 36"
                fill="currentColor"
                className="text-primary/30"
              >
                <path d="M0 36V22.5C0 10.5 6 3 18 0l2.4 3.9C13.2 6.3 9.6 10.5 9 16.5H18V36H0zm30 0V22.5C30 10.5 36 3 48 0l2.4 3.9C43.2 6.3 39.6 10.5 39 16.5H48V36H30z" />
              </svg>
            </div>

            <p
              className="max-w-2xl tracking-normal text-center text- lg sm:text-xl text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedQuote }}
            />

            <div className="mt-8 flex flex-col items-center gap-1">
              {authorImage && (
                <div className="mb-3 relative size-12 rounded-full overflow-hidden">
                  <Image
                    src={authorImage}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-foreground text-base">
                {authorName}
              </span>
              <span className="text-muted-foreground text-base">
                {authorPosition}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  },
);

Testimonial.displayName = "Testimonial";
