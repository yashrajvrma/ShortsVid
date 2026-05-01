import { getAllBlogs } from "@/lib/blog";
import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

// ─── Tool pages ──────────────────────────────────────────────────────────────
// Add a new slug here each time a /tools/* page is built.
const TOOL_SLUGS = [
  "brainrot-video-generator",
  "minecraft-parkour-generator",
  "tiktok-transcript",
  "fake-imessage-generator",
  "fake-instagram-dm",
  "tiktok-money-calculator",
  "italian-brainrot-generator",
  "pdf-to-brainrot",
  "reddit-story-generator",
  "youtube-shorts-generator",
];

// ─── Alternatives / comparison pages ─────────────────────────────────────────
// These are published as regular blog posts under /blog/ — no separate route
// needed. getAllBlogs() picks them up automatically.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const blogs = getAllBlogs().map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tools = TOOL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9, // second-highest — these are the main traffic pages
  }));



  return [
    // ── Core pages ──────────────────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...tools,
    ...blogs,
  ];
}
