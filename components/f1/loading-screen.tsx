"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface LoadingScreenProps {
  failed?: boolean;
  onRetry?: () => void;
}

export function LoadingScreen({ failed = false, onRetry }: LoadingScreenProps) {
  const [dots, setDots] = useState(".");
  const [mounted, setMounted] = useState(false);

  // Ensure animations start after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (failed) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [failed]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      {mounted && (
        <div 
          className="absolute inset-0 opacity-10 loading-grid"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo - Extra large on all devices */}
        <div className="relative">
          <img
            src="/images/logov1t.png"
            alt="F1 Intelligence Hub"
            className={`h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 brightness-0 invert opacity-90 ${failed ? '' : 'loading-pulse'}`}
          />
        </div>

        {failed ? (
          /* Error State */
          <>
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <p className="text-lg font-semibold">Failed to load F1 data</p>
            </div>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Unable to connect to the F1 data service. Please check your connection and try again.
            </p>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </>
        ) : (
          /* Loading State */
          <>
            {/* Loading bars (like F1 starting lights) */}
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-12 sm:w-4 sm:h-16 rounded-full bg-red-500/20 relative overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-red-500 to-red-300 loading-fill"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
              ))}
            </div>

            {/* Status text */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </div>
                <p className="text-foreground font-semibold text-base sm:text-lg">
                  Retrieving F1 Data<span className="inline-block w-6 text-left">{dots}</span>
                </p>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Connecting to live telemetry
              </p>
            </div>

            {/* Racing line animation */}
            <div className="w-64 sm:w-80 h-1 bg-muted/30 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent loading-slide" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
