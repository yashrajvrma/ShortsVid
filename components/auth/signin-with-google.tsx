"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import loginImg1 from "@/public/images/E4sxmoEYhqg.jpg";
import loginImg2 from "@/public/images/kdkdkdkdkeo30303.jpg";
import loginImg3 from "@/public/images/maxresdefault.jpg";
import { Spinner } from "../ui/spinner";

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

export default function LoginCard() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/app",
        errorCallbackURL: "/error",
        fetchOptions: {
          onSuccess: () => {
            console.log("signin successful");
            toast.success("Signed in successfully");
          },
          onError: (error) => {
            console.error("Error occurred:", error);
            toast.error(`Sign in failed: ${error}`);
          },
        },
      });
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="relative w-full sm:w-[320px] flex flex-col items-center">
        {/* ── Fanned cards — perfectly centered, half above card ── */}
        {/* 
          All 3 cards share the same transform-origin (bottom-center).
          They are stacked absolutely inside a fixed-size container
          that is itself centered above the card via negative margin.
        */}
        <div className="relative w-[160px] h-[120px] mb-0 z-10">
          {/* Left card */}
          {/* <div
            className="absolute w-[80px] h-[104px] rounded-2xl shadow-md"
            style={{
              background: "linear-gradient(135deg, #ffb347, #ff8c42)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) translateX(-48px) rotate(-15deg)",
              zIndex: 1,
            }}
          /> */}
          <Image
            className="absolute w-[75px] h-[110px] rounded-2xl shadow-md border-2 border-double"
            src={loginImg1}
            alt="login-img1"
            style={{
              background: "linear-gradient(135deg, #ffb347, #ff8c42)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) translateX(-48px) rotate(-15deg)",
              zIndex: 1,
            }}
          />
          {/* <Image
            className="absolute w-[80px] h-[104px] rounded-2xl shadow-md"
            src={loginImg1}
            alt="login-img1"
          />
          <Image
            className="absolute w-[80px] h-[104px] rounded-2xl shadow-md"
            src={loginImg1}
            alt="login-img1"
          /> */}
          {/* Center card — on top */}
          {/* <div
            className="absolute w-[80px] h-[104px] rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ffe066, #ffd700)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) rotate(0deg)",
              zIndex: 3,
            }}
          /> */}
          <Image
            className="absolute w-[75px] h-[110px] rounded-2xl shadow-md border-2 border-double"
            src={loginImg3}
            alt="login-img3"
            style={{
              background: "linear-gradient(135deg, #ffe066, #ffd700)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) rotate(0deg)",
              zIndex: 3,
            }}
          />
          {/* Right card */}
          {/* <div
            className="absolute w-[80px] h-[104px] rounded-2xl shadow-md"
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) translateX(48px) rotate(15deg)",
              zIndex: 2,
            }}
          /> */}
          <Image
            className="absolute w-[75px] h-[110px] rounded-2xl shadow-md border-2 border-double"
            src={loginImg2}
            alt="login-img2"
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
              bottom: 0,
              left: "50%",
              transformOrigin: "bottom center",
              transform: "translateX(-50%) translateX(48px) rotate(15deg)",
              zIndex: 2,
            }}
          />
        </div>

        {/* ── Card — images overlap top ── */}
        <div
          className="w-full bg-card rounded-2xl shadow-sm px-7 pb-7 flex flex-col items-center gap-4 text-center h-[280px]"
          style={{ paddingTop: "72px", marginTop: "-52px" }}
        >
          <h1 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
            Create viral Reels before
            <br />
            your competitors do
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI shorts generator trusted by{" "}
            <span className="font-medium text-foreground">100K+</span> creators
            making viral content every day.
          </p>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-1 bg-foreground text-background hover:bg-foreground/90 h-11 text-sm font-medium rounded-xl gap-2"
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

        <p className="text-center px-3 py-4 text-sm ">
          By clicking continue, you agree to our {""}
          <span>
            <a href="/terms" className="underline hover:text-muted-foreground">
              Terms of Service
            </a>
          </span>{" "}
          and {""}
          <a href="/privacy" className="underline hover:text-muted-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
