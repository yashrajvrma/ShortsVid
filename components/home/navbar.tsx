"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/shortsvid-icon.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav className="fixed z-50 w-full bg-background/95 backdrop-blur-4xl shadow-sm h-16">
      <div className="flex items-center justify-between max-w-5xl mx-auto py-2">
        <Link className="flex" href="/">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            ShortsVid
          </span> */}
          {/* <img src={logo} alt="shortsvid-logo" width={140} /> */}
          <div className="flex items-center text-2xl font-semibold tracking-tighter leading-tight gap-1">
            {/* Shorts Vid */}
            <Image
              src={logo}
              alt="shortsVid-logo"
              className="w-12 rotate-[-5deg]"
              loading="eager"
            />
            ShortsVid
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-base">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
          <a
            href="#blog"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="rounded-lg font-medium text-base px-4"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
