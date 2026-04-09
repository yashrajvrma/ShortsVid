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
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  PieChartIcon,
  HomeIcon,
  MapIcon,
  PencilLineIcon,
  Gamepad,
  Gamepad2Icon,
  PlusIcon,
  Play,
  UserRound,
} from "lucide-react";
import { useSession } from "@/lib/auth/client";
import Image from "next/image";
import ShortsVidLogo from "@/public/shortsvid-icon.png";
import Link from "next/link";
import { NavShorts } from "./nav-shorts";
import { Button } from "./ui/button";
import { customerPortal } from "@/actions/billing/customer-portal";
import CreditUsageCard from "./credit-usage-card";

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
  projects: [
    {
      name: "Home",
      url: "/app",
      icon: <HomeIcon />,
    },
    {
      name: "Library",
      url: "/app/videos",
      icon: <Play />,
    },
  ],
  shorts: [
    {
      name: "Faceless Shorts",
      url: "/app/shorts/faceless-shorts",
      icon: <UserRound />,
    },
    {
      name: "Gameplay Videos",
      url: "/app/shorts/gameplay-videos",
      icon: <Gamepad2Icon />,
    },
  ],
};

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
        <NavProjects projects={data.projects} />
        <NavShorts shorts={data.shorts} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <CreditUsageCard />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
