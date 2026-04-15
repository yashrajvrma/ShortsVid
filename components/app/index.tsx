import Image from "next/image";
import Link from "next/link";
import ShortsVidIcon from "@/public/shortsvid-icon.png";
import { Button } from "@/components/ui/button";
import { Gamepad2, UserRound } from "lucide-react";

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
    title: "Conversation Videos",
    description:
      "Viral gaming clips with captions, background music, and AI narration — ready to post in minutes.",
    href: "/app/shorts/conversation-videos",
  },
];

export default function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full px-4 sm:gap-10 gap-8">
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
