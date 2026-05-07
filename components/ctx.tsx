import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallToAction({ link }: { link: string }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden bg-neutral-900 rounded-3xl px-8 py-12 text-center text-primary-foreground">
        {/* Decorative glow blobs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
            Ready to go viral?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto tracking-tight">
            Join 100K+ creators making faceless Shorts every day. Start for free
            — no credit card required.
          </p>
          <div className="flex flex-col justify-center sm:flex-row gap-3">
            <Link
              href="/app"
              id="faceless-cta-signup-btn"
              className="inline-flex items-center justify-center gap-2 bg-primary text-secondary-foreground font-medium px-7 py-3 rounded-xl transition-colors text-base tracking-tight"
            >
              Start creating for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* <Link
                        href="/app"
                        id="faceless-cta-signup-btn"
                        className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary font-medium px-7 py-3 rounded-xl hover:bg-primary-foreground/90 transition-colors text-sm tracking-tight"
                      >
                        Start creating for Free
                        <ArrowRight className="w-4 h-4" />
                      </Link> */}
            <a
              href={link}
              className="inline-flex items-center justify-center gap-2 font-medium px-7 py-3 rounded-xl bg-white/20 transition-colors text-base"
            >
              Try the tool first
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
