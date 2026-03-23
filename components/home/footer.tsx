import Link from "next/link";
import Image from "next/image";
import logo from "@/public/shortsvid-light-icon.png";
import buildfastIcon from "@/public/buildfast-icon.png";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-foreground sm:mt-20 mt-12">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-0 sm:py-16 py-14">
        {/* Top row: Brand left, Links + Legal right */}
        <div className="flex flex-col sm:flex-row justify-between gap-y-10">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-1 w-fit">
              <Image
                src={logo}
                alt="ShortsVid"
                className="w-8 rotate-[-5deg]"
              />
              <span className="text-xl font-semibold tracking-tighter text-primary-foreground">
                ShortsVid
              </span>
            </Link>

            <p className="text-base text-muted-foreground max-w-[280px] mt-2">
              AI-powered shorts generator for YouTube, TikTok & Instagram Reels.
            </p>

            <a
              href="https://buildfast.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 w-fit rounded-lg border border-double text-secondary bg-background px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Built with
              <Image src={buildfastIcon} alt="buildfast-icon" className="w-3" />
              Buildfast
            </a>
          </div>

          {/* Links + Legal grouped on the right */}
          <div className="flex gap-12 sm:gap-16">
            {/* Links */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-tight text-muted-foreground">
                Links
              </span>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-primary-foreground hover:opacity-70 transition-opacity w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-tight text-muted-foreground">
                Legal
              </span>
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-primary-foreground hover:opacity-70 transition-opacity w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-12 pt-6 border-t border-border/20">
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} - All rights reserved
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by{" "}
            <a
              href="https://twitter.com/yashrajvrma"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary-foreground transition-colors"
            >
              Yashraj
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
