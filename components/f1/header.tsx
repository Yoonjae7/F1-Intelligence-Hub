"use client";

import { useState, useEffect } from "react";
import { Circle, Radio } from "lucide-react";

interface HeaderProps {
  isLive?: boolean;
  session?: {
    name: string;
    location: string;
    country: string;
    circuit: string;
  };
  loading?: boolean;
}

export function Header({ isLive = false, session, loading = false }: HeaderProps) {
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

  const sessionName = session ? `${session.location} ${session.name}` : "Monaco Grand Prix";

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
          {isLive ? (
            <>
              <Radio className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-red-500 font-semibold">LIVE</span>
            </>
          ) : loading ? (
            <>
              <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
              <span className="text-muted-foreground">Connecting...</span>
            </>
          ) : (
            <>
              <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
              <span className="text-muted-foreground">Demo Mode</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{sessionName}</span>
          <span className="text-foreground font-mono">{currentTime}</span>
        </div>
      </div>
    </header>
  );
}
