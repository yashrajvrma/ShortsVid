"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "@/trpc/client";

// const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TRPCReactProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
        ></Toaster>
        <TooltipProvider>{children}</TooltipProvider>
        {/* {children} */}
      </TRPCReactProvider>
    </div>
  );
};
