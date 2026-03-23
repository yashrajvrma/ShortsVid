import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GameplayComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center gap-5 w-full">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-muted border border-border">
        <Gamepad2 className="size-6 text-muted-foreground" />
      </div>

      <Badge
        variant="secondary"
        className="text-sm font-medium tracking-normal uppercase rounded-sm"
      >
        Coming Soon
      </Badge>

      <div className="flex flex-col gap-2 sm:max-w-lg max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gameplay Videos
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          We're working on something epic. AI-powered gameplay clips with
          captions, music, and narration — dropping very soon.
        </p>
      </div>

      <Button asChild variant="outline" size="lg" className="gap-2 mt-2">
        <Link href="/app">
          <ArrowLeft className="size-4" />
          Go Back
        </Link>
      </Button>
    </div>
  );
}
