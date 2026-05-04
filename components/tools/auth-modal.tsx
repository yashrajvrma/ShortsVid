"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import loginImg1 from "@/public/images/E4sxmoEYhqg.webp";
import loginImg2 from "@/public/images/kdkdkdkdkeo30303.webp";
import loginImg3 from "@/public/images/maxresdefault.webp";

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The URL to redirect back to after successful Google sign-in */
  callbackURL: string;
}

export default function AuthModal({
  open,
  onOpenChange,
  callbackURL,
}: AuthModalProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: "/error",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
          onError: (error) => {
            toast.error(`Sign in failed: ${error}`);
          },
        },
      });
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40 backdrop-blur-md" />
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-sm [&>button]:hidden bg-secondary-foreground"
        >
          <div className="relative flex flex-col items-center w-full px-6 py-6">
            {/* Close button */}
            <DialogClose asChild>
              <button
                className="absolute top-3 right-3 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-card border border-border shadow-sm hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DialogClose>

            {/* Fanned images */}
            <div className="relative w-[180px] h-[130px] mb-0 z-10">
              <Image
                className="absolute w-[85px] h-[120px] rounded-2xl shadow-md border-2 border-double object-cover"
                src={loginImg1}
                alt="preview"
                style={{
                  bottom: 0,
                  left: "50%",
                  transformOrigin: "bottom center",
                  transform:
                    "translateX(-50%) translateX(-52px) rotate(-15deg)",
                  zIndex: 1,
                }}
              />
              <Image
                className="absolute w-[85px] h-[120px] rounded-2xl shadow-md border-2 border-double object-cover"
                src={loginImg3}
                alt="preview"
                style={{
                  bottom: 0,
                  left: "50%",
                  transformOrigin: "bottom center",
                  transform: "translateX(-50%) rotate(0deg)",
                  zIndex: 3,
                }}
              />
              <Image
                className="absolute w-[85px] h-[120px] rounded-2xl shadow-md border-2 border-double object-cover"
                src={loginImg2}
                alt="preview"
                style={{
                  bottom: 0,
                  left: "50%",
                  transformOrigin: "bottom center",
                  transform: "translateX(-50%) translateX(52px) rotate(15deg)",
                  zIndex: 2,
                }}
              />
            </div>

            {/* Card */}
            <div
              className="w-full bg-card rounded-2xl shadow-sm px-8 pb-8 flex flex-col items-center gap-5 text-center"
              style={{ paddingTop: "80px", marginTop: "-60px" }}
            >
              <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-snug">
                Sign in to generate
                <br />
                your video
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Free to start — join{" "}
                <span className="font-medium text-foreground">100K+</span>{" "}
                creators making viral content.
              </p>

              <Button
                id="auth-modal-google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full mt-1 bg-foreground text-background hover:bg-foreground/90 h-12 text-sm font-medium rounded-xl gap-2"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>

            <p className="text-center px-3 py-4 text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-foreground">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
