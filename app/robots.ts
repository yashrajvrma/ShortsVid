import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

  const allowedPaths = [
    "/",
    "/login",
    "/pricing",
    "/faq",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/blog/",
    "/tools",
    "/tools/",
    "/llms.txt",
    "/llms-full.txt",
  ];

  return {
    rules: [
      // ── Standard crawlers (Google, Bing, etc.) ──────────────────────────
      {
        userAgent: "*",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
        // /_next/ intentionally NOT disallowed — renderers need it
      },

      // ── OpenAI / ChatGPT ────────────────────────────────────────────────
      {
        userAgent: "GPTBot",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },

      // ── Anthropic / Claude ──────────────────────────────────────────────
      {
        userAgent: "anthropic-ai",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },

      // ── Google Extended (Bard / Gemini training) ────────────────────────
      {
        userAgent: "Google-Extended",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },

      // ── Perplexity ──────────────────────────────────────────────────────
      {
        userAgent: "PerplexityBot",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },

      // ── Meta / Llama ────────────────────────────────────────────────────
      {
        userAgent: "facebookexternalhit",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },

      // ── Common AI research bots ─────────────────────────────────────────
      {
        userAgent: "CCBot",
        allow: allowedPaths,
        disallow: ["/app/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

