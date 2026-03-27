// import { prisma } from "@/db";
// import { auth } from "@/lib/auth/server";
// import { headers } from "next/headers";
// import { Separator } from "@/components/ui/separator";
// import { ArrowRight } from "lucide-react";
// import { customerPortal } from "@/actions/billing/customer-portal";

// export default async function CreditUsageCard() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session?.user) return null;

//   const userRecord = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     include: { subscription: true },
//   });

//   if (!userRecord?.subscription) return null;

//   const plan = userRecord.plan ?? "Free";
//   const credits: number = userRecord.credit ?? 0;
//   const billingEnd = userRecord.subscription.currentPeriodEnd
//     ? new Date(userRecord.subscription.currentPeriodEnd).toLocaleDateString(
//         "en-US",
//         { month: "long", day: "numeric", year: "numeric" },
//       )
//     : null;

//   return (
//     <div className="w-full rounded-xl border border-border bg-card text-card-foreground overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-3 py-2">
//         <span className="text-sm font-normal tracking-tight text-muted-foreground">
//           Current Plan
//         </span>
//         <span className="text-sm font-semibold tracking-tight uppercase text-foreground">
//           {plan}
//         </span>
//       </div>

//       <Separator />

//       {/* Credits Body */}
//       <div className="flex flex-col px-3 py-2 space-y-1">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-normal tracking-tight text-muted-foreground">
//             Remaining Credits
//           </p>
//           <p className="text-sm font-semibold tracking-tight text-foreground leading-none">
//             {credits.toLocaleString()}
//           </p>
//         </div>
//         {billingEnd && (
//           <p className="text-xs text-muted-foreground font-normal tracking-tight leading-relaxed pt-1 max-w-[260px]">
//             Billing cycle ends on {billingEnd}. Unused credits will roll over to
//             the next period.
//           </p>
//         )}
//       </div>
//       {/* <div className="px-3 py-2 space-y-1">
//         <p className="text-sm font-normal tracking-tight text-muted-foreground">
//           Remaining Credits
//         </p>
//         <p className="text-3xl font-semibold tracking-tight text-foreground leading-none">
//           {credits.toLocaleString()}
//         </p>
//         {billingEnd && (
//           <p className="text-xs text-muted-foreground font-normal tracking-tight leading-relaxed pt-1 max-w-[260px]">
//             Billing cycle ends on {billingEnd}. Unused credits will roll over to
//             the next period.
//           </p>
//         )}
//       </div> */}

//       <Separator />

//       {/* Footer — native form so the server action works inside a server component */}
//       <form action={customerPortal}>
//         <button
//           type="submit"
//           className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted transition-colors group cursor-pointer"
//         >
//           <span className="text-sm font-medium tracking-tight text-foreground">
//             Manage Subscription
//           </span>
//           <ArrowRight className="w-4 h-4 text-foreground transition-transform group-hover:translate-x-0.5" />
//         </button>
//       </form>
//     </div>
//   );
// }

import { prisma } from "@/db";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { customerPortal } from "@/actions/billing/customer-portal";
import Link from "next/link";

export default async function CreditUsageCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!userRecord) return null;

  const plan = userRecord.plan ?? "FREE";
  const credits: number = userRecord.credit ?? 0;
  const hasSubscription = !!userRecord.subscription;
  const billingEnd = userRecord.subscription?.currentPeriodEnd
    ? new Date(userRecord.subscription.currentPeriodEnd).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" },
      )
    : null;

  return (
    <div className="w-full rounded-xl border border-border bg-card text-card-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-normal tracking-tight text-muted-foreground">
          Current Plan
        </span>
        <span className="text-sm font-semibold tracking-tight uppercase text-foreground">
          {plan}
        </span>
      </div>

      <Separator />

      {/* Credits Body */}
      <div className="flex flex-col px-3 py-2 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-normal tracking-tight text-muted-foreground">
            Remaining Credits
          </p>
          <p className="text-sm font-semibold tracking-tight text-foreground leading-none">
            {credits.toLocaleString()}
          </p>
        </div>
        {billingEnd ? (
          <p className="text-xs text-muted-foreground font-normal tracking-tight leading-relaxed pt-1 max-w-[260px]">
            Billing cycle ends on {billingEnd}. Unused credits will roll over to
            the next period.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground font-normal tracking-tight leading-relaxed pt-1 max-w-[260px]">
            Upgrade to a paid plan to get more credits and unlock all features.
          </p>
        )}
      </div>

      <Separator />

      {/* Footer */}
      {hasSubscription ? (
        <form action={customerPortal}>
          <button
            type="submit"
            className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted transition-colors group cursor-pointer"
          >
            <span className="text-sm font-medium tracking-tight text-primary">
              Manage Subscription
            </span>
            <ArrowRight className="w-4 h-4 text-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      ) : (
        <Link
          href="/#pricing"
          className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted transition-colors group"
        >
          <span className="text-sm font-medium tracking-tight text-primary">
            Upgrade Plan
          </span>
          <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
