import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  if (session) {
    redirect("/app");
  }

  return (
    <div>
      {/* Name : {session?.user.name}
      Email : {session?.user.email} */}
    </div>
  );
}
