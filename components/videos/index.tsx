"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Header from "../header";
import FetchAllVideo from "./fetch-all-video";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AllVideos() {
  const trpc = useTRPC();
  const [activeTab, setActiveTab] = useState<
    "facelessShorts" | "conversationVideo"
  >("facelessShorts");

  const { data: shorts, isLoading: isLoadingShorts } = useQuery(
    trpc.videos.getAllShorts.queryOptions(),
  );
  const { data: convVideos, isLoading: isLoadingConv } = useQuery(
    trpc.videos.getAllConversationVideos.queryOptions(),
  );

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="w-full flex-1 flex flex-col">
        <Header>
          <div className="flex items-center gap-x-1">
            {/* 
            <Button
              variant="ghost"
              onClick={() => setActiveTab("facelessShorts")}
              className={`text-base font-normal hover:bg-transparent text-muted-foreground hover:text-foreground hover:cursor-pointer ${activeTab === "facelessShorts" && "text-foreground underline underline-offset-10 decoration-muted-foreground font-medium"}`}
            >
              Faceless Shorts
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("conversationVideo")}
              className={`text-base font-normal hover:bg-transparent text-muted-foreground hover:text-foreground hover:cursor-pointer ${activeTab === "conversationVideo" && "text-foreground underline underline-offset-10 decoration-muted-foreground font-medium"}`}
            >
              Conversation Videos
            </Button>
            */}

            <Tabs
              value={activeTab}
              onValueChange={(val) =>
                setActiveTab(val as "facelessShorts" | "conversationVideo")
              }
            >
              <TabsList className="bg-transparent border border-border w-full rounded-lg min-h-12 gap-2">
                <TabsTrigger
                  value="facelessShorts"
                  className="rounded-md px-4 py-2 data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground transition-all text-base"
                >
                  Faceless Shorts
                </TabsTrigger>
                <TabsTrigger
                  value="conversationVideo"
                  className="rounded-md px-4 py-2 data-[state=active]:bg-foreground data-[state=active]:text-primary-foreground transition-all text-base"
                >
                  Conversation Videos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Header>

        <div className="mt-4 outline-none">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-20">
            {activeTab === "facelessShorts" &&
              (isLoadingShorts ? (
                <div className="flex items-center w-full justify-center py-5">
                  <p className="text-muted-foreground text-lg">Loading...</p>
                </div>
              ) : !shorts || shorts.length === 0 ? (
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
              (isLoadingConv ? (
                <div className="flex items-center w-full justify-center py-5">
                  <p className="text-muted-foreground text-lg">Loading...</p>
                </div>
              ) : !convVideos || convVideos.length === 0 ? (
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
