import Link from "next/link";
import { Zap, Twitter, Linkedin, Youtube } from "lucide-react";

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                ShortsVid
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[220px] text-center md:text-left">
              AI shorts generator for YouTube, TikTok & Instagram.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShortsVid. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
