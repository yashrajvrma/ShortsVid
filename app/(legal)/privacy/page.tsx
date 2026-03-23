import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import PrivacyPolicy from "@/components/legal/privacy-policy";

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <PrivacyPolicy />
      <Footer />
    </section>
  );
}
