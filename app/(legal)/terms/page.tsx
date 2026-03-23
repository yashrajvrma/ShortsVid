import { Footer } from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import TermsOfService from "@/components/legal/terms-of-service";

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <Navbar />
      <TermsOfService />
      <Footer />
    </section>
  );
}
