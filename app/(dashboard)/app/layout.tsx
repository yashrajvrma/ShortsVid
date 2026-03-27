import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ShortsVidLogo from "@/public/shortsvid-icon.png";
import React from "react";
import Image from "next/image";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PricingModal } from "@/components/app/pricing-modal";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  // Show pricing modal if user has no active subscription or is on free plan
  const isFreePlan = !user?.subscription || user.plan === "FREE" || !user.plan;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 sticky top-0 items-center gap-2 visible md:hidden bg-background/60 backdrop-blur-sm w-full">
          <div className="flex justify-between gap-2 px-4 w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/app">
                    <div className="flex items-center text-2xl font-semibold tracking-tighter text-black leading-tight gap-1">
                      <Image
                        src={ShortsVidLogo}
                        alt="shortsVid-logo"
                        className="w-8 rotate-[-5deg]"
                        loading="eager"
                      />
                      ShortsVid
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex h-full p-4">{children}</div>
      </SidebarInset>

      {/* Pricing gate — renders on top of everything for free plan users */}
      {isFreePlan && <PricingModal />}
    </SidebarProvider>
  );
}
