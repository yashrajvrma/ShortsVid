import { HomeIcon, Play, ScanFace, UsersRound } from "lucide-react";

export type NavItem = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

export const navProjects: NavItem[] = [
  {
    name: "Home",
    url: "/app",
    icon: <HomeIcon />,
  },
  {
    name: "Library",
    url: "/app/library",
    icon: <Play />,
  },
];

export const navShorts: NavItem[] = [
  {
    name: "Faceless Shorts",
    url: "/app/shorts/faceless-shorts",
    icon: <ScanFace />,
  },
  {
    name: "Conversation Videos",
    url: "/app/shorts/conversation-videos",
    icon: <UsersRound />,
  },
];

/** Flat list of every nav item — used to build the breadcrumb URL→label map */
export const allNavItems: NavItem[] = [...navProjects, ...navShorts];
