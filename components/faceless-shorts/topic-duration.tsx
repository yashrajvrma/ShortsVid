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
  onTopicChange: (value: string) => void;
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
        <label className="text-sm font-semibold text-foreground">
          2. Topic
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTopicChange(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
                topic === t.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="size-4" />
          Duration
        </label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDurationChange(d.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-all duration-200 ${
                duration === d.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
