"use client";

import { useState, useEffect } from "react";
import { Circle } from "lucide-react";

export function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 h-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <img
          src="/images/logov1t.png"
          alt="F1 Intelligence Hub"
          className="h-40 brightness-0 invert opacity-90"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
          <span className="text-muted-foreground">Live Session</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Monaco Grand Prix</span>
          <span className="text-foreground font-mono">{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
