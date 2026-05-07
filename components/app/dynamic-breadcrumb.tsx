"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { allNavItems } from "@/components/dashboard-nav";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Find the nav item whose URL matches the current path (longest match wins)
  const match = allNavItems
    .filter(
      (item) => pathname === item.url || pathname.startsWith(item.url + "/"),
    )
    .sort((a, b) => b.url.length - a.url.length)[0];

  const label = match?.name ?? "Dashboard";

  return (
    <div className="flex items-center text-base text-muted-foreground">
      {/* <span className="text-foreground/40">·</span> */}
      <BreadcrumbPage className="font-normal text-foreground">
        {label}
      </BreadcrumbPage>
    </div>
  );
}
