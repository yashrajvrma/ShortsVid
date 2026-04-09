import { getAllBlogs, getBlogBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/components/blog/mdx-components";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import Navbar from "@/components/home/navbar";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Not Found" };

  return {
    title: `${blog.title} — ShortsVid Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [{ url: blog.coverImage }],
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header: title + author + date */}
        <BlogHeader title={blog.title} date={blog.date} author={blog.author} />

        {/* Cover image */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* MDX Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <MDXRemote source={blog.content} components={getMDXComponents()} />
        </div>

        {/* Footer: CTA card + back to all posts */}
        <BlogFooter />
      </main>
    </>
  );
}
