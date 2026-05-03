import { getAllBlogs } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";
import Navbar from "@/components/home/navbar";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import logo from "@/public/shortsvid-icon.png";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, tutorials, and insights on creating viral AI short videos. Learn how to grow your channel with ShortsVid.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    url: "https://shortsvid.pro/blog",
    title: "Blog",
    description:
      "Tips, tutorials, and insights on creating viral AI short videos.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description:
      "Tips, tutorials, and insights on creating viral AI short videos.",
  },
};

export default function BlogPage() {
  const blogs = getAllBlogs();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <section className="pt-32 pb-16 px-4 sm:px-6 sm:max-w-6xl mx-auto flex flex-col gap-14">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-center">
            All posts
          </h1>

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <p className="text-muted-foreground text-sm">
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.slug} blog={blog} index={i} />
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="rounded-2xl border border-border bg-muted/40 flex flex-col items-center text-center gap-6 py-12 px-6">
            <Image
              src={logo}
              alt="ShortsVid logo"
              width={56}
              height={56}
              className="w-14 h-14 object-contain -rotate-6"
            />

            <p className="text-xl sm:text-2xl font-semibold text-foreground max-w-xl leading-snug">
              Create viral shorts for TikTok and YouTube in minutes using AI
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
