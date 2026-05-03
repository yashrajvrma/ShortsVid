import Navbar from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
