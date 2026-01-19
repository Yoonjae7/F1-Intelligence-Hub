"use client";

import { Timer, Gauge, Thermometer, Wind } from "lucide-react";

interface Weather {
  airTemp?: number;
  trackTemp?: number;
  windSpeed?: number;
  windDirection?: number;
  humidity?: number;
  rainfall?: boolean;
}

interface StatCardsProps {
  weather?: Weather | null;
}

export function StatCards({ weather }: StatCardsProps) {
  const stats = [
    {
      label: "Fastest Lap",
      value: "1:14.265",
      subtext: "VER - Lap 38",
      icon: Timer,
    },
    {
      label: "Air Temp",
      value: weather?.airTemp ? `${weather.airTemp}°C` : "28°C",
      subtext: weather?.humidity ? `${weather.humidity}% humidity` : "Dry",
      icon: Gauge,
    },
    {
      label: "Track Temp",
      value: weather?.trackTemp ? `${weather.trackTemp}°C` : "48°C",
      subtext: weather?.rainfall ? "Wet" : "Dry",
      icon: Thermometer,
    },
    {
      label: "Wind",
      value: weather?.windSpeed ? `${Math.round(weather.windSpeed)}` : "12",
      subtext: "km/h",
      icon: Wind,
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-3 sm:p-4 border border-border hover:border-border/80 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg sm:text-xl font-mono font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
