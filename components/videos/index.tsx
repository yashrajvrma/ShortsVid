"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { AllShorts } from "@/types";
import Header from "../header";
import FetchAllVideo from "./fetch-all-video";

export default function AllVideos() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.videos.getAllShorts.queryOptions());
  console.log("data is", JSON.stringify(data));

  return (
    <div className="flex flex-col h-screen w-full">
      <Header>
        <div className="text-xl tracking-tight">All Videos</div>
      </Header>
      <div className="flex flex-wrap items-center gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {data?.map((video: AllShorts) => {
              return <FetchAllVideo key={video.id} videoData={video} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}
