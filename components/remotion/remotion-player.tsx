// "use client";

// import { Player } from "@remotion/player";
// import RemotionComposition from "./remotion-composition";
// import { AllShorts } from "@/types";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { AspectRatio } from "../ui/aspect-ratio";

// export default function RemotionPlayer({
//   videoData,
// }: {
//   videoData: AllShorts;
// }) {
//   const router = useRouter();

//   const handleClick = () => {
//     router.push(`/app/videos/${videoData.id}`);
//   };

//   return (
//     <div
//       // onClick={handleClick}
//       className="flex flex-col flex-wrap w-full hover:scale-[1.02] transition-transform"
//     >
//       {/* <Player
//         className="border-border rounded-xl bg-neutral-300 hover:cursor-pointer"
//         component={RemotionComposition}
//         durationInFrames={
//           videoData?.duration ? Math.ceil(videoData?.duration * 30) : 1
//         }
//         compositionWidth={1080}
//         compositionHeight={1920}
//         fps={30}
//         controls
//         style={{
//           height: "40vh",
//           // height: "55vh",
//           // aspectRatio: "9/16",
//         }}
//         inputProps={{
//           videoData,
//           durationInFrames: videoData?.duration
//             ? Math.ceil(videoData?.duration * 30)
//             : 1,
//         }}
//       /> */}
//       <div className="flex flex-col w-full max-w-xs">
//         <AspectRatio ratio={9 / 16} className="relative rounded-lg bg-muted">
//           {videoData.signedThumbnailUrl && (
//             <Image
//               src={videoData.signedThumbnailUrl}
//               alt="videos"
//               fill
//               // sizes="(max-width: 768px) 100vw, 320px"
//               className="rounded-lg object-cover"
//               unoptimized
//             />
//           )}
//         </AspectRatio>
//       </div>
//     </div>
//   );
// }

"use client";

import { AllShorts } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Spinner } from "@/components/ui/spinner";
import { CircleAlert } from "lucide-react";

export default function RemotionPlayer({
  videoData,
}: {
  videoData: AllShorts;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (videoData.status === "SUCCESS") {
      router.push(`/app/videos/${videoData.id}`);
    }
  };

  const duration = videoData.duration
    ? `${Math.floor(videoData.duration / 60)}:${String(
        Math.floor(videoData.duration % 60),
      ).padStart(2, "0")}`
    : null;

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-[180px] cursor-pointer hover:scale-[1.03] transition-transform"
    >
      <AspectRatio
        ratio={9 / 16}
        className="relative rounded-xl overflow-hidden bg-muted"
      >
        {/* Thumbnail */}
        {videoData.signedThumbnailUrl && (
          <Image
            src={videoData.signedThumbnailUrl}
            alt="video thumbnail"
            fill
            className="object-cover"
            unoptimized
          />
        )}

        {/* Duration badge (YouTube style) */}
        {duration && videoData.status === "SUCCESS" && (
          <div className="absolute bottom-2 right-2 text-white text-xs font-medium bg-black/30 px-2 py-1 rounded">
            {duration}
          </div>
        )}

        {/* FAILED overlay */}
        {videoData.status === "FAILED" && (
          <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/50">
            <CircleAlert className="size-6 text-red-500" />
            <span className="text-red-500 text-sm tracking-wide">
              Failed to generate
            </span>
          </div>
        )}

        {/* GENERATING overlay */}
        {videoData.status === "GENERATING" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
            <Spinner className="size-6 text-white" />
            <span className="text-white text-sm font-medium">
              Generating...
            </span>
          </div>
        )}
      </AspectRatio>
    </div>
  );
}
