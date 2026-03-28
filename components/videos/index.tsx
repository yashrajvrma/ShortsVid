"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { AllShorts } from "@/types";
import Header from "../header";
import FetchAllVideo from "./fetch-all-video";

export default function AllVideos() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.videos.getAllShorts.queryOptions());

  return (
    <div className="flex flex-col h-screen w-full">
      <Header>
        <div className="text-xl">All Videos</div>
      </Header>
      <div className="flex flex-wrap items-center gap-4">
        {isLoading ? (
          <div className="flex items-center w-full justify-center py-5">
            <p className="text-muted-foreground text-lg">Loading...</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex items-center w-full justify-center py-5">
            <p className="text-muted-foreground text-lg">
              No shorts created yet.
            </p>
          </div>
        ) : (
          data.map((video: AllShorts) => (
            <FetchAllVideo key={video.id} videoData={video} />
          ))
        )}
      </div>
    </div>
  );
}
