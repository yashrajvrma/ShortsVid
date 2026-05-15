import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full h-full items-center justify-center min-h-[50vh]">
      <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
