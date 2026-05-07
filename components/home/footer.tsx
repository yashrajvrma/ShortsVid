import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/shortsvid-icon.webp";
import buildfastIcon from "@/public/images/buildfast-icon.webp";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Guides", href: "/blog" },
  { label: "Free Tools", href: "/tools" },
];

const LEGAL_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact & Support", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const FREE_TOOLS = [
  { label: "Faceless Shorts Generator", href: "/tools/faceless-shorts" },
  { label: "AI Tiktok Shorts", href: "/tools/faceless-shorts" },
  { label: "Italian Brainrot Videos", href: "/app/shorts/conversation-videos" },
  { label: "Conversation Videos", href: "/app/shorts/conversation-videos" },
  {
    label: "Gameplay Background Videos",
    href: "/app/shorts/conversation-videos",
  },
];

const RESOURCES = [
  {
    label: "Best Faceless YouTube Channel",
    href: "/blog/faceless-youtube-channel-ideas-2026",
  },
  {
    label: "How to create Viral Shorts in 2026",
    href: "/blog/how-to-make-ai-shorts",
  },
];

export function Footer() {
  return (
    <footer className="w-full sm:mt-8 mt-6 border-border border-t">
      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Brand row */}
        <div className="flex flex-col gap-2 mb-8">
          <Link href="/" className="flex items-center gap-1 w-fit">
            <Image
              src={logo}
              draggable={false}
              alt="ShortsVid"
              className="w-8 rotate-[-5deg]"
            />
            <span className="text-xl font-semibold tracking-tighter text-neutral-900">
              ShortsVid
            </span>
          </Link>

          <p className="text-sm text-foreground mt-1">
            Automate viral Faceless shorts and earn passive income. No editing
            skills required!
          </p>

          <a
            href="https://buildfast.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1.5 w-fit rounded-sm border border-double text-secondary bg-background px-3 py-2 text-xs font-medium transition-colors"
          >
            Built with
            <Image src={buildfastIcon} alt="buildfast-icon" className="w-3" />
            Buildfast
          </a>
        </div>

        {/* Links grid — 2 cols on mobile, 4 cols on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Links
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground hover:opacity-70 transition-opacity w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Legal
            </span>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground hover:opacity-70 transition-opacity w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Free Tools */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Free Tools
            </span>
            {FREE_TOOLS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground hover:opacity-70 transition-opacity w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Resources
            </span>
            {RESOURCES.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-foreground hover:opacity-70 transition-opacity w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured On */}
        <div className="mt-5 pt-8">
          <span className="text-xs uppercase font-medium text-muted-foreground">
            Featured On
          </span>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://startupfa.me/s/shortsvid?utm_source=shortsvid.pro"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://startupfa.me/badges/featured/light.webp"
                alt="ShortsVid - Featured on Startup Fame"
                width={145}
                height={50}
                loading="eager"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a
              href="https://fazier.com/launches/shortsvid.pro"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light"
                alt="Fazier badge"
                width={195}
                height={54}
                loading="eager"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a
              href="https://www.foundrlist.com/product/shortsvid?utm_source=badge&utm_medium=embed"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.foundrlist.com/api/badge/shortsvid"
                alt="Featured on FoundrList"
                width={140}
                height={48}
                loading="eager"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a
              href="https://open-launch.com/projects/shortsvid"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://open-launch.com/api/badge/3e1a2038-b1bc-4d4a-a8ae-458f834baf1b/featured-light.svg"
                alt="Featured on Open-Launch"
                width={180}
                height={50}
                loading="eager"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a
              href="https://earlyhunt.com/project/shortsvid"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://earlyhunt.com/badges/earlyhunt-badge-light.svg"
                alt="Featured on EarlyHunt"
                width={150}
                height={45}
                loading="eager"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a href="https://wired.business" target="_blank">
              <img
                src="https://wired.business/badge0-white.svg"
                alt="Featured on Wired Business"
                width="145"
                height="54"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a href="https://toolfio.com" target="_blank" rel="dofollow">
              <img
                src="https://toolfio.com/toolfio-light-badge.png"
                alt="Featured on Toolfio"
                width="150"
                height="54"
                className="opacity-60 hover:opacity-100"
              />
            </a>

            <a
              href="https://www.scrolllaunch.com/products/shortsvid?ref=badge"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://www.scrolllaunch.com/api/badge/shortsvid?variant=featured&theme=light"
                alt="ShortsVid — Featured on ScrollLaunch"
                width="195"
                height="54"
                loading="lazy"
                className="opacity-60 hover:opacity-100"
              />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-8 pt-6 border-t border-border/20">
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} — All rights reserved
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for creators by{" "}
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
