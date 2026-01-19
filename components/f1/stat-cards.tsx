"use client";

import { Timer, Gauge, Thermometer, Wind } from "lucide-react";

const stats = [
  {
    label: "Fastest Lap",
    value: "1:14.265",
    subtext: "VER - Lap 38",
    icon: Timer,
    trend: null,
  },
  {
    label: "Top Speed",
    value: "342",
    subtext: "km/h - VER S3",
    icon: Gauge,
    trend: "up",
  },
  {
    label: "Track Temp",
    value: "48°C",
    subtext: "Dry conditions",
    icon: Thermometer,
    trend: null,
  },
  {
    label: "Wind Speed",
    value: "12",
    subtext: "km/h - NW",
    icon: Wind,
    trend: null,
  },
];

export function StatCards() {
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
