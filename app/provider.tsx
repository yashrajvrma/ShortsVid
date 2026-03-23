"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

// const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TRPCReactProvider>
        <Toaster
          className="text-sm font-normal font-sans"
          position="top-right"
        />
        <TooltipProvider>{children}</TooltipProvider>
        {/* {children} */}
      </TRPCReactProvider>
    </div>
  );
};
