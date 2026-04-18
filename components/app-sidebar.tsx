import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navProjects, navShorts } from "@/config/nav";
import { useSession } from "@/lib/auth/client";
import Image from "next/image";
import ShortsVidLogo from "@/public/shortsvid-icon.png";
import Link from "next/link";
import { NavShorts } from "./nav-shorts";
import { Button } from "./ui/button";
import { customerPortal } from "@/actions/billing/customer-portal";
import CreditUsageCard from "./credit-usage-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className="flex justify-start py-2 hover:bg-transparent"
              // size="lg"
              // asChild
              // <div
              //   className="flex justify-start py-2 hover:bg-transparent md:block hidden"
              // size="lg"
              // asChild
            >
              <Link href="/app">
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div> */}
                <div className="flex items-center text-xl font-semibold tracking-tighter leading-tight gap-1">
                  <Image
                    src={ShortsVidLogo}
                    alt="shortsVid-logo"
                    className="w-8 rotate-[-5deg]"
                    loading="eager"
                  />
                  ShortsVid
                </div>
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-1">
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={navProjects} />
        <NavShorts shorts={navShorts} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <CreditUsageCard />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
