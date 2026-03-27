import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

const inter = Inter({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";
const APP_NAME = "ShortsVid";
const APP_DESCRIPTION =
  "Generate viral YouTube Shorts, TikTok & Instagram Reels in seconds. Script, Visuals, Captions & Voiceover — all done by AI. No editing skills required.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `ShortsVid - #1 AI Shorts Generator`,
    template: `%s | ShortsVid`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "AI video generator",
    "YouTube Shorts creator",
    "Instagram Reels maker",
    "TikTok video generator",
    "faceless YouTube channel",
    "AI voiceover",
    "short video automation",
    "viral video creator",
    "text to video",
    "AI content creator",
    "no face YouTube",
    "automated video creation",
  ],
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `ShortsVid - #1 AI Shorts Generator`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `ShortsVid - #1 AI Shorts Generator`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shortsvid",
    creator: "@shortsvid",
    title: `ShortsVid - #1 AI Shorts Generator`,
    description: APP_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/web-app-manifest-192x192.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
