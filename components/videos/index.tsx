"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Header from "../header";
import FetchAllVideo from "./fetch-all-video";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllVideos() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<
    "facelessShorts" | "conversationVideo"
  >("facelessShorts");

  useEffect(() => {
    const videoType = searchParams.get("videoType");
    if (videoType === "conversation-video") {
      setActiveTab("conversationVideo");
    } else if (videoType === "faceless-shorts") {
      setActiveTab("facelessShorts");
    }
  }, [searchParams]);

  const handleTabChange = (val: "facelessShorts" | "conversationVideo") => {
    setActiveTab(val);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(
      "videoType",
      val === "conversationVideo" ? "conversation-video" : "faceless-shorts",
    );
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  const { data: shorts } = useQuery(trpc.videos.getAllShorts.queryOptions());
  const { data: convVideos } = useQuery(
    trpc.videos.getAllConversationVideos.queryOptions(),
  );

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full flex-1 flex flex-col">
        <Header>
          <div className="flex items-center gap-x-1">
            <Tabs
              value={activeTab}
              onValueChange={(val) =>
                handleTabChange(val as "facelessShorts" | "conversationVideo")
              }
            >
              <TabsList className="bg-transparent border border-border w-full rounded-lg min-h-12 gap-1">
                <TabsTrigger
                  value="facelessShorts"
                  className="rounded-md px-4 py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground transition-all text-base"
                >
                  Faceless Shorts
                </TabsTrigger>
                <TabsTrigger
                  value="conversationVideo"
                  className="rounded-md px-4 py-1.5 data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground transition-all text-base"
                >
                  Conversation Videos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Header>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-20">
            {activeTab === "facelessShorts" &&
              (!shorts || shorts.length === 0 ? (
                <div className="flex items-center w-full justify-center py-5">
                  <p className="text-muted-foreground text-lg">
                    No shorts created yet.
                  </p>
                </div>
              ) : (
                shorts.map((video: any) => (
                  <FetchAllVideo key={video.id} videoData={video} />
                ))
              ))}

            {activeTab === "conversationVideo" &&
              (!convVideos || convVideos.length === 0 ? (
                <div className="flex items-center w-full justify-center py-5">
                  <p className="text-muted-foreground text-lg">
                    No conversation videos created yet.
                  </p>
                </div>
              ) : (
                convVideos.map((video: any) => (
                  <FetchAllVideo key={video.id} videoData={video} />
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
