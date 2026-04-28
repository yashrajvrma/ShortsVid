import type { Metadata } from "next";
import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import PrivacyPolicy from "@/components/legal/privacy-policy";
import { env } from "@/lib/env";

const APP_URL = env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read ShortsVid's Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: { canonical: `${APP_URL}/privacy` },
  openGraph: {
    url: `${APP_URL}/privacy`,
    title: "Privacy Policy",
    description:
      "Read ShortsVid's Privacy Policy to understand how we collect, use, and protect your personal data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "Read ShortsVid's Privacy Policy to understand how we collect, use, and protect your personal data.",
  },
};

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <PrivacyPolicy />
      <Footer />
    </section>
  );
}
