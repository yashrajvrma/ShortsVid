import { getAllBlogs } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import Navbar from "@/components/home/navbar";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/shortsvid-icon.png";

export const metadata: Metadata = {
  title: "Blog — ShortsVid",
  description:
    "Tips, tutorials, and insights on creating viral AI short videos. Learn how to grow your channel with ShortsVid.",
  openGraph: {
    title: "Blog",
    description:
      "Tips, tutorials, and insights on creating viral AI short videos.",
    type: "website",
  },
};

export default function BlogPage() {
  const blogs = getAllBlogs();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex flex-col">
        <section className="flex flex-col flex-1 pt-32 pb-5 px-4 sm:px-6 max-w-5xl w-full mx-auto gap-16">
          {/* Page title */}
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tighter text-foreground text-center">
            All posts
          </h1>

          {/* Grid — grows to fill space */}
          <div className="flex-1">
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                <p className="text-muted-foreground text-sm">
                  No posts yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {blogs.map((blog, i) => (
                  <BlogCard key={blog.slug} blog={blog} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* CTA Footer — always at bottom */}
          <div className="rounded-2xl border border-border bg-sidebar flex flex-col items-center text-center gap-4 py-20 mt-10 px-6">
            <Image
              src={logo}
              alt="ShortsVid logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain -rotate-5"
            />
            <p className="text-xl font-medium text-foreground max-w-lg leading-snug">
              ShortsVid is the best tool to automate viral shorts for TikTok and
              YouTube Shorts
            </p>
            <Button asChild size="lg" className="rounded-xl px-6 font-medium">
              <Link href="/app">Try for free</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
