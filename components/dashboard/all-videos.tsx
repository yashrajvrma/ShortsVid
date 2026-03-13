"use client";

import { useTRPC } from "@/trpc/client";
import RemotionPlayer from "../remotion/remotion-player";
import { useQuery } from "@tanstack/react-query";
import { ShortsVideo } from "@/types";

export default function AllVideos() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.videos.getAllShorts.queryOptions());
  console.log("data is", JSON.stringify(data));

  return (
    <div className="flex flex-col justify-center gap-4">
      <h1 className="text-lg">Shorts</h1>
      <div className="flex flex-wrap justify-center items-center gap-x-4">
        {data?.map((video: ShortsVideo) => (
          <RemotionPlayer key={video.id} videoData={video} />
        ))}
      </div>
    </div>
  );
}
