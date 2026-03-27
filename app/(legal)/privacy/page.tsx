import type { Metadata } from "next";
import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import PrivacyPolicy from "@/components/legal/privacy-policy";

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read ShortsVid's Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: { canonical: `${APP_URL}/privacy` },
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
