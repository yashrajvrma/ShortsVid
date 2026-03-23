// import Image from "next/image";
// import { HeroSection } from "./feature-carousel";
// import ShortsVidIcon from "@/public/shortsvid-icon.png";
// export default function App() {
//   const images = [
//     {
//       src: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//       alt: "Professional portrait of a woman",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//       alt: "Scenic landscape with mountains and a lake",
//     },
//     {
//       src: "https://plus.unsplash.com/premium_photo-1670282392820-e3590c1c5c54?w=900&auto=format&fit=crop&q=60",
//       alt: "Artistic photo of a girl with flowers",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//       alt: "A dog wearing sunglasses",
//     },
//     {
//       src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGdpcmx8ZW58MHx8MHx8fDA%3D",
//       alt: "Creative shot of a person from behind",
//     },
//   ];

//   //   const title = (
//   //     <>
//   //       Edit Your{" "}
//   //       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
//   //         Photos{" "}
//   //       </span>{" "}
//   //       on the Go
//   //     </>
//   //   );

//   return (
//     <div className="flex flex-col justify-center items-center h-screen w-full">
//       {/* <div className="mb-2">
//         <Image src={ShortsVidIcon} alt="shortsvid-icon" className="w-16" />
//       </div> */}
//       <h1 className="flex flex-col items-center sm:text-5xl text-3xl font-medium font-sans tracking-tighter max-w-xl ">
//         What are you{" "}
//         <span className="flex items-center">
//           creating
//           <Image
//             src={ShortsVidIcon}
//             alt="shortsvid-icon"
//             className="sm:w-16 w-12 ml-1 rotate-[-5deg]"
//           />
//           today?
//         </span>
//       </h1>
//       <div className="flex items-center w-sm">
//         <HeroSection
//           //   title={title}
//           subtitle=""
//           images={images}
//           //   appStoreLink="#"
//           //   googlePlayLink="#"
//         />
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import ShortsVidIcon from "@/public/shortsvid-icon.png";
import { Button } from "@/components/ui/button";
import { MonitorPlay, Gamepad2, UserRound } from "lucide-react";

const OPTIONS = [
  {
    icon: <UserRound className="size-5" />,
    title: "Faceless Shorts",
    description:
      "Quick, engaging short videos perfect for platforms like YouTube Shorts, Instagram Reels, and TikTok — no face required.",
    href: "/app/shorts/faceless-shorts",
  },
  {
    icon: <Gamepad2 className="size-5" />,
    title: "Gameplay Videos",
    description:
      "Viral gaming clips with captions, background music, and AI narration — ready to post in minutes.",
    href: "/app/shorts/gameplay-videos",
  },
];

export default function App() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full px-4 sm:gap-10 gap-8">
      {/* Heading */}
      <h1 className="flex flex-col items-center text-center sm:text-5xl text-3xl font-medium tracking-tighter max-w-xl">
        What are you{" "}
        <span className="flex items-center">
          creating
          <Image
            src={ShortsVidIcon}
            alt="shortsvid-icon"
            className="sm:w-16 w-12 ml-1 rotate-[-5deg]"
          />
          today?
        </span>
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {OPTIONS.map((option) => (
          <div
            key={option.title}
            className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-lg font-medium text-foreground tracking-tight">
                {option.icon}
                {option.title}
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full text-sm">
              <Link href={option.href}>Start Creating</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
