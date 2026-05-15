import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <Skeleton className="w-full h-10 rounded-xl bg-neutral-200" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full aspect-9/14 rounded-xl bg-neutral-200"
          />
        ))}
      </div>
    </div>
  );
}
