import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/app/dynamic-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/db";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PricingModal } from "@/components/app/pricing-modal";
import { Separator } from "@/components/ui/separator";
import PostHogIdentify from "@/components/posthog/posthog-identify";

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

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  // const user = await prisma.user.findUnique({
  //   where: { id: session.user.id },
  //   include: { subscription: true },
  // });

  // Show pricing modal if user has no active subscription or is on free plan
  // const isNoCredit = user?.credit === 0;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 sticky top-0 items-center gap-2 visible md:hidden bg-background/60 backdrop-blur-sm w-full">
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
        </header> */}
        {/* posthog identify provider  */}
        <PostHogIdentify user={session.user} />

        <header className="flex sm:h-15 h-14 shrink-0 items-center align-middle gap-2 border-b sticky top-0 bg-background z-50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center">
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex h-screen px-4">{children}</div>
      </SidebarInset>

      {/* Pricing gate — renders on top of everything for free plan users */}
      {/* {isNoCredit && <PricingModal />} */}
    </SidebarProvider>
  );
}
