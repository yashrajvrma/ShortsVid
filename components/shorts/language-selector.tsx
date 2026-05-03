"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const getFlagUrl = (code: string) => {
  const countryMap: Record<string, string> = {
    en: "us",
    de: "de",
    fr: "fr",
    ru: "ru",
    ja: "jp",
    zh: "cn",
  };
  const countryCode = countryMap[code] || "us";
  return `https://flagcdn.com/${countryCode}.svg`;
};

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground py-10">
        Language
      </label>
      <div className="py-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2.5">
                  <img
                    src={getFlagUrl(lang.code)}
                    alt={`${lang.name} flag`}
                    className="w-4 h-3 object-cover rounded-[1px] shadow-sm"
                  />
                  <span>{lang.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
