import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ShortsVidLogo from "@/public/shortsvid-icon.png";
import React from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 sticky top-0 items-center gap-2 visible md:hidden bg-background/60 backdrop-blur-sm w-full">
          <div className="flex justify-between gap-2 px-4 w-full">
            {/* <SidebarTrigger className="-ml-1" /> */}
            {/* <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            /> */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="">
                  <BreadcrumbLink href="/app">
                    {/* <Image
                      src={ShortsVidLogo}
                      alt="shortsVid-logo"
                      className="w-[130]"
                      loading="eager"
                    /> */}
                    <div className="flex items-center text-2xl font-semibold tracking-tighter text-black leading-tight gap-1">
                      {/* Shorts Vid */}
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
                {/* <BreadcrumbSeparator className="" />
                <BreadcrumbItem className="">
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div> */}
        <div className="flex h-full p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
