import { Blog, BlogMeta } from "@/types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type { BlogMeta, Blog };

const BLOGS_DIR = path.join(process.cwd(), "data/blogs");

export function getAllBlogs(): BlogMeta[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];

  const files = fs.readdirSync(BLOGS_DIR);

  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      const stats = readingTime(raw);

      return {
        slug,
        title: data.title ?? "Untitled",
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString(),
        tags: data.tags ?? [],
        coverImage: data.coverImage ?? "/blog/covers/default.jpg",
        author: data.author ?? "ShortsVid Team",
        authorImage: data.authorImage ?? undefined,
        readingTime: stats.text,
        published: data.published ?? true,
      } satisfies BlogMeta;
    })
    .filter((b) => b.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogBySlug(slug: string): Blog | null {
  const filepath = path.join(BLOGS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(raw);

  return {
    slug,
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString(),
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? "/blog/covers/default.jpg",
    author: data.author ?? "ShortsVid Team",
    authorImage: data.authorImage ?? undefined,
    readingTime: stats.text,
    published: data.published ?? true,
    content,
  };
}
