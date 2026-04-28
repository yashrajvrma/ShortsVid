import type { Metadata } from "next";
import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import About from "@/components/legal/about";
import { env } from "@/lib/env";

const APP_URL = env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ShortsVid.pro — the AI-powered short video generator built for creators, marketers, and storytellers.",
  alternates: { canonical: `${APP_URL}/about` },
  openGraph: {
    url: `${APP_URL}/about`,
    title: "About",
    description:
      "Learn about ShortsVid.pro — the AI-powered short video generator built for creators, marketers, and storytellers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description:
      "Learn about ShortsVid.pro — the AI-powered short video generator built for creators, marketers, and storytellers.",
  },
};

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <About />
      <Footer />
    </section>
  );
}
