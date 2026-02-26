"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignInWithGoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(!loading);

      await signIn.social({
        provider: "google",
        callbackURL: "/", // redirect url after the user signs in
        errorCallbackURL: "/error",
        fetchOptions: {
          onSuccess: () => {
            console.log("signin successful");
          },
          onError: (error) => {
            // display error message
            console.error("Error occurred:", error);
            toast.error(`${error}`);
          },
        },
      });
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Failed to log you in. Pls try again after some time");
    } finally {
      setLoading(!loading);
    }
  };
  return (
    <Button disabled={loading} onClick={handleGoogleLogin} variant="secondary">
      Sign in with Google
    </Button>
  );
}
