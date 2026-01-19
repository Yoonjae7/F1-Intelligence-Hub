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
      trend: null,
    },
    {
      label: "Air Temp",
      value: weather?.airTemp ? `${weather.airTemp}°C` : "28°C",
      subtext: weather?.humidity ? `${weather.humidity}% humidity` : "Dry conditions",
      icon: Gauge,
      trend: null,
    },
    {
      label: "Track Temp",
      value: weather?.trackTemp ? `${weather.trackTemp}°C` : "48°C",
      subtext: weather?.rainfall ? "Wet conditions" : "Dry conditions",
      icon: Thermometer,
      trend: null,
    },
    {
      label: "Wind Speed",
      value: weather?.windSpeed ? `${Math.round(weather.windSpeed)}` : "12",
      subtext: "km/h",
      icon: Wind,
      trend: null,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-4 border border-border hover:border-border/80 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-mono font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
