"use client";

import { useState, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Captions,
  ArrowRight,
  ScanFace,
  UsersRound,
  AudioLines,
  Music,
  Sparkles,
  Zap,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/images/shortsvid-icon.webp";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth/client";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Script Generation",
    description: "Generate viral scripts with AI in seconds",
    href: "/#features",
  },
  {
    icon: AudioLines,
    title: "Voices",
    description: "50+ Elevenlabs voices",
    href: "/#features",
  },
  {
    icon: Music,
    title: "Background Music",
    description: "Curated stock of background music",
    href: "/#features",
  },
  {
    icon: Captions,
    title: "Captions",
    description: "Choose from 20+ viral caption styles",
    href: "/#features",
  },
  {
    icon: Zap,
    title: "Faster Rendering",
    description: "1080p video renders in ~45 seconds",
    href: "/#features",
  },
];

const FREE_TOOLS = [
  {
    icon: ScanFace,
    title: "Faceless Shorts",
    description: "Generate viral faceless short videos",
    href: "/tools/faceless-shorts",
  },
  {
    icon: Flame,
    title: "Brainrot Explainer Videos",
    description: "Create brainrot explainer videos",
    href: "/tools/brainrot-video-generator",
  },
  {
    icon: UsersRound,
    title: "Conversation Videos",
    description: "Create text to conversation videos",
    href: "/tools/brainrot-video-generator",
  },
];

const NAV_LINKS = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Guides" },
];

interface DropdownItem {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const NavDropdown = ({
  label,
  items,
  viewAllHref,
  viewAllLabel,
}: {
  label: string;
  items: DropdownItem[];
  viewAllHref: string;
  viewAllLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-1 text-base font-normal text-foreground hover:text-muted-foreground transition-colors select-none cursor-pointer">
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 opacity-60" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key={`${label}-dropdown`}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-sm z-50"
          >
            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground font-normal mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border">
                <Link
                  href={viewAllHref}
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 px-7 py-4 transition-colors group"
                >
                  <span className="font-medium">{viewAllLabel}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Reusable Mobile Accordion ────────────────────────────────────────────────

const MobileAccordion = ({
  label,
  items,
  viewAllHref,
  viewAllLabel,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  viewAllHref: string;
  viewAllLabel: string;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-base font-normal text-foreground hover:text-muted-foreground transition-colors rounded-md px-3 py-2.5"
      >
        <span>{label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 opacity-60" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key={`mobile-${label}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-border space-y-0.5 pb-1 mt-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/60 transition-colors group"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-normal mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}

              <Link
                href={viewAllHref}
                onClick={onClose}
                className="flex justify-between items-center gap-1.5 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
              >
                {viewAllLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session?.user;

  const NavButtons = ({ className }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-start w-full md:pb-0 pb-2">
        {!isPending && !isLoggedIn && (
          <Button
            variant="ghost"
            className="text-foreground hover:text-muted-foreground tracking-tight text-base font-medium transition-colors hover:bg-transparent cursor-pointer"
            asChild
          >
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          </Button>
        )}
      </div>

      <Button
        className="rounded-lg text-base font-medium px-4 cursor-pointer"
        asChild
      >
        <Link href="/app" onClick={() => setOpen(false)}>
          Open App
        </Link>
      </Button>
    </div>
  );

  return (
    <>
      <nav className="fixed z-50 w-full bg-background/80 backdrop-blur-3xl border-b sm:h-16 h-16">
        <div className="flex items-center justify-between max-w-6xl mx-auto h-full px-4 sm:px-3">
          {/* Logo */}
          <Link className="flex" href="/" onClick={() => setOpen(false)}>
            <div className="flex items-center text-xl font-semibold tracking-tighter leading-tight gap-1">
              <Image
                src={logo}
                alt="shortsVid-logo"
                className="w-8 rotate-[-5deg]"
                loading="eager"
              />
              ShortsVid
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <NavDropdown
              label="Features"
              items={FEATURES}
              viewAllHref="/#features"
              viewAllLabel="View all features"
            />

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-muted-foreground text-base font-normal transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <NavDropdown
              label="Free Tools"
              items={FREE_TOOLS}
              viewAllHref="/tools"
              viewAllLabel="View all tools"
            />
          </div>

          {/* Desktop buttons + mobile hamburger */}
          <div className="flex items-center gap-2">
            <NavButtons className="hidden md:flex" />

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-16 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-b border-border shadow-md h-screen"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              <MobileAccordion
                label="Features"
                items={FEATURES}
                viewAllHref="/#features"
                viewAllLabel="View all features"
                onClose={() => setOpen(false)}
              />

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-normal text-foreground hover:text-muted-foreground transition-colors rounded-md px-3 py-2.5"
                >
                  {link.label}
                </Link>
              ))}

              <MobileAccordion
                label="Free Tools"
                items={FREE_TOOLS}
                viewAllHref="/tools"
                viewAllLabel="View all tools"
                onClose={() => setOpen(false)}
              />
              <div className="mt-2">
                <NavButtons className="flex-col [&>button]:w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
