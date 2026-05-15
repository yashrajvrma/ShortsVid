import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 h-screen w-full">
      {/* Top bar — full width */}
      <Skeleton className="w-full h-10 rounded-lg bg-neutral-200 shrink-0" />

      {/* Main content — 30/70 split */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — 30% */}
        <Skeleton className="w-[30%] h-full rounded-lg bg-neutral-200" />

        {/* Right — 70% */}
        <Skeleton className="w-[70%] h-full rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}
