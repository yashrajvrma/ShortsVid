import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 h-screen w-full">
      {/* Top bar — full width */}
      <Skeleton className="w-full h-12 rounded-xl shrink-0 bg-neutral-200" />

      {/* Main content — 70/30 split */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — 70% */}
        <Skeleton className="w-[70%] h-full rounded-xl bg-neutral-200" />

        {/* Right — 30% */}
        <Skeleton className="w-[30%] h-full rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
