import SignInWithGoogleButton from "@/components/auth/signin-with-google";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/app");
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <SignInWithGoogleButton />
    </div>
  );
}
