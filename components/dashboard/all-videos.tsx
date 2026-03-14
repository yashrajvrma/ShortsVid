"use client";

import { useTRPC } from "@/trpc/client";
import RemotionPlayer from "../remotion/remotion-player";
import { useQuery } from "@tanstack/react-query";
import { ShortsVideo } from "@/types";

export default function AllVideos() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.videos.getAllShorts.queryOptions());
  console.log("data is", JSON.stringify(data));

  return (
    <div className="flex flex-col gap-4 h-screen w-full">
      <h1 className="text-xl font-medium tracking-tight">All Videos</h1>
      <div className="flex flex-wrap items-center gap-x-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {data?.map((video: ShortsVideo) => (
              <RemotionPlayer key={video.id} videoData={video} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
