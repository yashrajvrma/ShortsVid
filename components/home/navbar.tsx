"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/shortsvid-icon.webp";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth/client";

const NAV_LINKS = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "#features", label: "Features" },
  { href: "/tools", label: "AI Video Tools" },
  { href: "/blog", label: "Blog" },
];

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const isLoggedIn = !!session?.user;

  const NavButtons = ({ className }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Login — only visible when not logged in */}
      <div className="flex items-start w-full md:pb-0 pb-2">
        {!isPending && !isLoggedIn && (
          <Button
            variant="ghost"
            className="text-foreground hover:text-muted-foreground tracking-tight text-base font-medium transition-colors hover:bg-transparent cursor-pointer"
            onClick={() => {
              router.push("/login");
              setOpen(false);
            }}
          >
            Login
          </Button>
        )}
      </div>

      {/* Open App — always visible, always goes to /app */}
      <Button
        variant="default"
        className="rounded-lg font-medium text-base px-4 cursor-pointer"
        onClick={() => {
          router.push("/app");
          setOpen(false);
        }}
      >
        Open App
      </Button>
    </div>
  );

  return (
    <>
      <nav className="fixed z-50 w-full bg-background/80 backdrop-blur-3xl sm:h-16 h-16">
        <div className="flex items-center justify-between max-w-5xl mx-auto h-full px-4 sm:px-3">
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
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-muted-foreground tracking-tight text-base font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground hover:text-muted-foreground transition-colors rounded-md px-3 py-2.5"
                >
                  {link.label}
                </Link>
              ))}
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
