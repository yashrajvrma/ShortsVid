"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function LanguageSelector({
  value,
  onValueChange,
}: LanguageSelectorProps) {
  const selected = LANGUAGES.find((l) => l.code === value);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5 text-primary" />
        Language
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language">
            {selected && (
              <span className="flex items-center gap-2">
                <span>{selected.flag}</span>
                <span>{selected.name}</span>
                <span className="text-muted-foreground text-xs uppercase">
                  ({selected.code})
                </span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="text-muted-foreground text-xs uppercase ml-auto">
                  {lang.code}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
