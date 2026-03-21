import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Youtube } from "lucide-react";
import logo from "@/public/shortsvid-icon.png";
import buildfastIcon from "@/public/buildfast-icon.png";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com/shortsvid", label: "Twitter" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/shortsvid",
    label: "LinkedIn",
  },
  { icon: Youtube, href: "https://youtube.com/@shortsvid", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* Brand — full width on mobile, 2 cols on lg */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-1 w-fit">
              <Image
                src={logo}
                alt="ShortsVid"
                className="w-8 rotate-[-5deg]"
              />
              <span className="text-xl font-semibold tracking-tighter text-foreground">
                ShortsVid
              </span>
            </Link>

            <p className="text-base text-muted-foreground max-w-[280px] mt-1">
              AI-powered shorts generator for YouTube, TikTok & Instagram Reels.
            </p>

            <p className="text-base text-muted-foreground mt-1">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>

            <p className="text-base text-muted-foreground mt-1">
              Made with ❤️ by{" "}
              <a
                href="https://twitter.com/yashrajvrma"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Yashraj
              </a>
            </p>

            <a
              href="https://buildfast.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1.5 w-fit rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-muted transition-colors "
            >
              Built with
              <Image src={buildfastIcon} alt="buildfast-icon" className="w-3" />
              Buildfast
            </a>
          </div>

          {/* Links — col 1 on mobile */}
          <div className="col-span-1 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
              Links
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal — col 2 on mobile */}
          <div className="col-span-1 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
              Legal
            </span>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
