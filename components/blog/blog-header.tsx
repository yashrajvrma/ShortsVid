"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/images/shortsvid-icon.webp";
import { formatDate } from "@/lib/utils";

interface BlogHeaderProps {
  title: string;
  date: string;
  author: string;
}

export function BlogHeader({ title, date, author }: BlogHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center pt-32 pb-10 px-4 max-w-3xl mx-auto"
    >
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-foreground leading-tight mb-4">
        {title}
      </h1>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Image
            src={logo}
            alt="ShortsVid"
            width={20}
            height={20}
            className="w-6 h-6 -rotate-5"
          />

          <span className="font-medium text-foreground trakcing-tight">
            {author}
          </span>
        </div>
        <span className="text-border">·</span>
        <span>{formatDate(date)}</span>
      </div>
    </motion.div>
  );
}
