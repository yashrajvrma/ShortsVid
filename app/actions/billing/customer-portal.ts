"use server";

import { prisma } from "@/db";
import { auth } from "@/lib/auth/server";
import { polar } from "@/lib/polar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const customerPortal = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!subscription) {
    throw new Error("No active subscription");
  }

  const result = await polar.customerSessions.create({
    customerId: subscription.polarCustomerId,
  });

  redirect(result.customerPortalUrl);
};
