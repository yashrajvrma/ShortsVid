import type { Metadata } from "next";
import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import ContactAndSupport from "@/components/legal/contact-and-support";

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the ShortsVid team. We're here to help with questions, support, and feedback.",
  alternates: { canonical: `${APP_URL}/contact` },
};

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <ContactAndSupport />
      <Footer />
    </section>
  );
}
