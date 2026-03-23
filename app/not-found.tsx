import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
      <p className="text-7xl font-bold tracking-tighter text-foreground">404</p>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Button asChild variant="outline" size="lg" className="gap-2 mt-2">
        <Link href="/app">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
