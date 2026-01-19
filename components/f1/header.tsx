"use client";

import { useState, useEffect } from "react";
import { Circle, Radio, Menu, X } from "lucide-react";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const sessionName = session ? `${session.location} ${session.name}` : "Grand Prix";

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 h-16 sm:h-20 md:h-24 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 overflow-visible">
        <img
          src="/images/logov1t.png"
          alt="F1 Intelligence Hub"
          className="h-12 sm:h-16 md:h-20 brightness-0 invert opacity-90 scale-[2] sm:scale-[2] md:scale-[2.5] origin-left"
        />
      </div>

      {/* Desktop: Full info */}
      <div className="hidden sm:flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 text-sm">
          {isLive ? (
            <>
              <Radio className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-red-500 font-semibold">LIVE</span>
            </>
          ) : loading ? (
            <>
              <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
              <span className="text-muted-foreground text-xs sm:text-sm">Connecting...</span>
            </>
          ) : (
            <>
              <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
              <span className="text-muted-foreground text-xs sm:text-sm">Demo Mode</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-xs sm:text-sm text-muted-foreground">
          <span className="font-medium truncate max-w-[120px] md:max-w-none">{sessionName}</span>
          <span className="text-foreground font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Mobile: Compact info + menu toggle */}
      <div className="flex sm:hidden items-center gap-3">
        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              DEMO
            </span>
          )}
        </div>
        
        {/* Time */}
        <span className="text-foreground font-mono text-xs">{currentTime}</span>
      </div>
    </header>
  );
}
