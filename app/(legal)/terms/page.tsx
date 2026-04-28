import type { Metadata } from "next";
import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import TermsOfService from "@/components/legal/terms-of-service";
import { env } from "@/lib/env";

const APP_URL = env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read ShortsVid's Terms of Service to understand your rights and responsibilities when using our AI video generation platform.",
  alternates: { canonical: `${APP_URL}/terms` },
  openGraph: {
    url: `${APP_URL}/terms`,
    title: "Terms of Service",
    description:
      "Read ShortsVid's Terms of Service to understand your rights and responsibilities when using our AI video generation platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description:
      "Read ShortsVid's Terms of Service to understand your rights and responsibilities when using our AI video generation platform.",
  },
};

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <TermsOfService />
      <Footer />
    </section>
  );
}
