"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    // <QueryClientProvider client={queryClient}>
    <div>
      <Toaster position="top-center" reverseOrder={false} gutter={8}></Toaster>
      <TooltipProvider>{children}</TooltipProvider>
      {/* {children} */}
    </div>

    // </QueryClientProvider>
  );
};
