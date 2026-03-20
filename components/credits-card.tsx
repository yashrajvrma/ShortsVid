import { prisma } from "@/db";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default async function CreditUsageCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const userSubscription = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      subscription: true,
    },
  });

  if (!userSubscription?.subscription) {
    return (
      <div className="flex flex-col gap-y-2 w-full rounded-xl px-3 py-3 border border-double text-sm">
        <div className="flex justify-between font-semibold">
          <div>Current Plan</div>
          <div>{userSubscription?.plan}</div>
        </div>
        <div>You don't have an active subscription</div>
        <Button>Upgrade Subscription</Button>
      </div>
    );
  }

  // had subscription
  return (
    <div className="flex flex-col gap-y-1 w-full rounded-xl px-3 py-3 border border-double text-sm">
      <div className="flex justify-between">
        <div>Current Plan</div>
        <p className="font-semibold">{userSubscription.plan}</p>
      </div>

      <p className="rounded-sm font-semibold text-xl bg-transparent text-primary">
        {userSubscription.credit}
      </p>
      <p>Total Credits</p>

      <div className="pt-2">
        <Button className="w-full" variant="secondary">
          Manage subscrption
        </Button>
      </div>
    </div>
  );
}
