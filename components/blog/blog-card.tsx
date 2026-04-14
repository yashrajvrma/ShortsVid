"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { BlogMeta } from "@/types";
import { formatDate } from "@/lib/utils";
import logoIcon from "@/public/shortsvid-icon.png";

interface BlogCardProps {
  blog: BlogMeta;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block h-full">
        <div className="h-full rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:max-w-[360px] w-full">
          {/* Cover Image */}
          <div className="relative w-full aspect-video overflow-hidden bg-muted">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Tag overlay */}
            {/* {blog.tags[0] && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 shadow-sm">
                  {blog.tags[0]}
                </Badge>
              </div>
            )} */}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 px-3 py-4 gap-1">
            <div className="flex items-center gap-x-1 py-2">
              <Image
                src={logoIcon}
                alt="logo"
                width={24}
                height={24}
                className="rounded-full -rotate-5"
              />

              <p className="text-sm font-medium tracking-tight">ShortsVid</p>
            </div>
            <h2 className="text-lg font-semibold tracking-tight leading-snug text-card-foreground transition-colors line-clamp-2">
              {blog.title}
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 flex-1 tracking-tight">
              {blog.description}
            </p>

            {/* Meta footer */}
            {/* <div className="flex items-center justify-between pt-2 mt-auto border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{formatDate(blog.date)}</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readingTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readingTime}</span>
                Read more
              </div>
            </div> */}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
