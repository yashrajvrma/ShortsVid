import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/login",
          "/about",
          "/contact",
          "/privacy",
          "/terms",
          "/blog/",
          "/tools/",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/app/", "/api/"],
        // /_next/ intentionally NOT disallowed — Google needs it to render pages
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
