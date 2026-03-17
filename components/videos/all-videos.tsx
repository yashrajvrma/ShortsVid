"use client";

import { useTRPC } from "@/trpc/client";
import RemotionPlayer from "../remotion/remotion-player";
import { useQuery } from "@tanstack/react-query";
import { AllShorts, ShortsVideo } from "@/types";
import Header from "../header";

export default function AllVideos() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.videos.getAllShorts.queryOptions());
  console.log("data is", JSON.stringify(data));

  return (
    <div className="flex flex-col h-screen w-full">
      <Header>
        <div className="text-xl tracking-tighter">All Videos</div>
      </Header>
      <div className="flex flex-wrap items-center gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {data?.map((video: AllShorts) => {
              return <RemotionPlayer key={video.id} videoData={video} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}
