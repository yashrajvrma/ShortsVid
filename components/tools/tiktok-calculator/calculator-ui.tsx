"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";

export default function TikTokCalculatorUi() {
  const [views, setViews] = useState<number>(23500);
  const [engagement, setEngagement] = useState<number>(15);
  const [isCalculated, setIsCalculated] = useState(false);

  const stats = useMemo(() => {
    const monthlyViews = views * 30;
    const yearlyViews = views * 365;

    const dailyMin = (views / 1000) * 0.02;
    const dailyMax = (views / 1000) * 0.9;

    const monthlyMin = dailyMin * 30;
    const monthlyMax = dailyMax * 30;

    const yearlyMin = dailyMin * 365;
    const yearlyMax = dailyMax * 365;

    return {
      monthlyViews,
      yearlyViews,
      daily: { min: dailyMin, max: dailyMax },
      monthly: { min: monthlyMin, max: monthlyMax },
      yearly: { min: yearlyMin, max: yearlyMax },
    };
  }, [views]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toString();
  };

  return (
    <div className="w-full flex flex-col font-sans max-w-4xl mx-auto">
      <Card className="overflow-hidden border border-border bg-card rounded-2xl p-0">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Side: Inputs */}
          <div className="flex-1 p-4 sm:py-20 sm:px-12 space-y-4">
            <div className="space-y-8">
              {/* Daily Views Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium text-foreground">
                    Daily Video Views
                  </Label>
                  <span className="text-2xl font-bold text-secondary tabular-nums">
                    {views.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[views]}
                  min={1000}
                  max={1000000}
                  step={1000}
                  onValueChange={(val) => {
                    setViews(val[0]);
                    setIsCalculated(false);
                  }}
                  className="py-3"
                />
              </div>

              {/* Engagement Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-foreground">
                    Average Engagement Rate
                  </Label>
                  <span className="text-2xl font-bold text-secondary tabular-nums">
                    {engagement}%
                  </span>
                </div>
                <Slider
                  value={[engagement]}
                  min={1}
                  max={50}
                  step={0.5}
                  onValueChange={(val) => {
                    setEngagement(val[0]);
                    setIsCalculated(false);
                  }}
                  className="py-3"
                />
                <p className="text-xs text-muted-foreground">
                  Don't know your engagement rate?{" "}
                  <Link
                    href="/tools/tiktok-engagement-rate-calculator"
                    className="text-secondary underline"
                  >
                    Use our free calculator
                  </Link>
                </p>
              </div>
            </div>

            {/* View Stats */}
            <div className="grid grid-cols sm:grid-cols-1 gap-3 py-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-sm">
                  Views per Month
                </span>
                <span className="text-foreground font-bold text-lg">
                  {formatNumber(stats.monthlyViews)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-sm">
                  Views per Year
                </span>
                <span className="text-foreground font-bold text-lg">
                  {formatNumber(stats.yearlyViews)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="default"
                onClick={() => setIsCalculated(true)}
                className="w-full h-12 text-base font-medium rounded-lg transition-all"
              >
                Calculate My Earnings
              </Button>
              <p className="text-center text-muted-foreground text-xs">
                Free • No Sign in required
              </p>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="w-full lg:w-[420px] bg-muted m-4 sm:p-4 flex flex-col justify-center space-y-4 border-border rounded-xl">
            {/* Daily Earnings Card */}
            <div className="bg-neutral-50 backdrop-blur-md border border-white/50 rounded-3xl p-8 space-y-3 transition-all duration-500">
              <div className="text-[#A5ADDF] font-bold text-xs uppercase tracking-wider">
                Estimated Daily Earnings
              </div>
              <div
                className={`text-3xl font-black transition-all duration-500 ${isCalculated ? "text-secondary" : "text-[#A5ADDF]"}`}
              >
                {isCalculated
                  ? `${formatCurrency(stats.daily.min)} - ${formatCurrency(stats.daily.max)}`
                  : "$$$ - $$$"}
              </div>
            </div>

            {/* Monthly Earnings Card */}
            <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-8 space-y-3 transition-all duration-500">
              <div className="text-[#A5ADDF] font-bold text-xs uppercase tracking-wider">
                Estimated Monthly Earnings
              </div>
              <div
                className={`text-3xl font-black transition-all duration-500 ${isCalculated ? "text-secondary" : "text-[#A5ADDF]"}`}
              >
                {isCalculated
                  ? `${formatCurrency(stats.monthly.min)} - ${formatCurrency(stats.monthly.max)}`
                  : "$$$$ - $$$$"}
              </div>
            </div>

            {/* Yearly Earnings Card */}
            <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-8 space-y-3 transition-all duration-500">
              <div className="text-[#A5ADDF] font-bold text-xs uppercase tracking-wider">
                Projected Yearly Earnings
              </div>
              <div
                className={`text-3xl font-black transition-all duration-500 ${isCalculated ? "text-secondary" : "text-[#A5ADDF]"}`}
              >
                {isCalculated
                  ? `${formatCurrency(stats.yearly.min)} - ${formatCurrency(stats.yearly.max)}`
                  : "$$$$$ - $$$$$"}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
