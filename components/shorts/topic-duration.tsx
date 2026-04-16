"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DURATIONS } from "@/lib/constants";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Topic } from "@prisma/client";

const TOPICS = [
  { id: "ANY_TOPIC", label: "Any Topic" },
  { id: "MOTIVATIONAL", label: "Motivational" },
  { id: "HORROR_STORY", label: "Horror Story" },
  { id: "HISTORY_FACTS", label: "History Facts" },
  { id: "PHILOSOPHY", label: "Philosophy" },
  { id: "STORYTELLING", label: "Storytelling" },
  { id: "MYSTERY_STORY", label: "Mystery Story" },
  { id: "LIFE_HACKS", label: "Life Hacks" },
];

interface TopicDurationProps {
  topic: string;
  duration: number;
  onTopicChange: (value: Topic) => void;
  onDurationChange: (value: number) => void;
}

export function TopicDuration({
  topic,
  duration,
  onTopicChange,
  onDurationChange,
}: TopicDurationProps) {
  return (
    <div className="space-y-4">
      {/* Topic */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Topic</label>
        <div className="flex flex-wrap gap-2 py-2">
          {TOPICS.map((t) => (
            <Button
              key={t.id}
              type="button"
              // @ts-ignore
              onClick={() => onTopicChange(t.id)}
              className={`px-3 py-2 text-sm border transition-all duration-200 rouned-lg ${topic === t.id
                ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
                }`}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {/* <Clock className="size-4" /> */}
          Duration
        </label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <Button
              key={d.id}
              type="button"
              onClick={() => onDurationChange(d.value)}
              className={`flex-1 px-3 py-2 text-sm font-medium border transition-all duration-200 rounded-lg ${duration === d.value
                ? "bg-secondary text-secondary-foreground shadow-sm hover:text-secondary-foreground hover:bg-secondary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground"
                }`}
            >
              {d.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
