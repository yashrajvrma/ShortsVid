"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

export default function TikTokEngagementCalculatorUi() {
  const [views, setViews] = useState<string>("");
  const [likes, setLikes] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [shares, setShares] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const calculateEngagement = () => {
    const v = parseFloat(views);
    const l = parseFloat(likes) || 0;
    const c = parseFloat(comments) || 0;
    const s = parseFloat(shares) || 0;

    if (!v || v <= 0) return;

    const rate = ((l + c + s) / v) * 100;
    setResult(rate);
  };

  const resetFields = () => {
    setViews("");
    setLikes("");
    setComments("");
    setShares("");
    setResult(null);
  };

  return (
    <div className="w-full flex flex-col font-sans max-w-4xl mx-auto">
      <Card className="overflow-hidden border border-border bg-card rounded-2xl p-0">
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          {/* Left Side: Inputs */}
          <div className="flex-1 p-4 sm:py-16 sm:px-12 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Total Views</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 10000"
                    value={views}
                    onChange={(e) => {
                      setViews(e.target.value);
                      setResult(null);
                    }}
                    className="h-11 rounded-lg border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Total Likes</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1500"
                    value={likes}
                    onChange={(e) => {
                      setLikes(e.target.value);
                      setResult(null);
                    }}
                    className="h-11 rounded-lg border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Total Comments</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 300"
                    value={comments}
                    onChange={(e) => {
                      setComments(e.target.value);
                      setResult(null);
                    }}
                    className="h-11 rounded-lg border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Total Shares <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={shares}
                    onChange={(e) => {
                      setShares(e.target.value);
                      setResult(null);
                    }}
                    className="h-11 rounded-lg border-border"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                variant="default"
                onClick={calculateEngagement}
                className="w-full h-12 text-base font-medium rounded-lg transition-all"
              >
                Calculate Engagement
              </Button>

              <button
                onClick={resetFields}
                className="w-full text-secondary font-medium text-sm hover:underline flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Fields
              </button>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="w-full lg:w-[420px] bg-muted m-4 sm:p-4 flex flex-col justify-center space-y-4 border-border rounded-xl">
            <div className="bg-neutral-50 backdrop-blur-md border border-white/50 rounded-3xl p-8 space-y-4 transition-all duration-500 text-center">
              <div className="text-[#A5ADDF] font-bold text-xs uppercase tracking-wider">
                Your Engagement Rate
              </div>
              <div
                className={`text-6xl font-black transition-all duration-500 ${result !== null ? "text-secondary" : "text-[#A5ADDF]"}`}
              >
                {result !== null ? `${result.toFixed(2)}%` : "-.--%"}
              </div>

              {result !== null && (
                <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result < 1 ? "Your engagement is low. Focus on creating stronger hooks to retain viewers." :
                      result < 3 ? "Good engagement! Your content is resonating reasonably well." :
                        result < 10 ? "Great engagement! The algorithm is likely pushing your content." :
                          "Viral engagement! Your content is performing exceptionally well."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
