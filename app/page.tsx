"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/f1/header";
import { LapTimesChart } from "@/components/f1/lap-times-chart";
import { StandingsTable } from "@/components/f1/standings-table";
import { GapChart } from "@/components/f1/gap-chart";
import { TyreStrategy } from "@/components/f1/tyre-strategy";
import { StatCards } from "@/components/f1/stat-cards";
import { AIChatPanel } from "@/components/f1/ai-chat-panel";
import { CircuitVisualization } from "@/components/f1/circuit-visualization";
import { LoadingScreen } from "@/components/f1/loading-screen";
import { useF1Data } from "@/hooks/use-f1-data";
import { demoData } from "@/lib/demo-data";
import { MessageCircle, X } from "lucide-react";

export default function F1IntelligenceHub() {
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { data: liveData, loading, error, isLive } = useF1Data({ refreshInterval: 10000 });
  
  const data = liveData || demoData;

  // Hide loading screen after initial data fetch + 2 second buffer
  useEffect(() => {
    if (!loading || liveData || error) {
      // 2 second buffer to show the nice loading screen
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, liveData, error]);

  useEffect(() => {
    if (highlightedChart) {
      const timer = setTimeout(() => {
        setHighlightedChart(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedChart]);

  // Show loading screen on initial load
  if (initialLoad && loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLive={isLive} 
        session={data.session} 
        loading={loading}
      />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-96px)]">
        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto pb-20 lg:pb-6">
          <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Error State */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-destructive">
                Unable to load live data. Showing demo data.
              </div>
            )}

            {/* Quick Stats */}
            <StatCards weather={data.weather} />

            {/* Charts Row 1 - Stack on mobile */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <LapTimesChart 
                highlighted={highlightedChart === "laptimes"} 
                lapData={data.lapTimes}
              />
              <StandingsTable 
                highlighted={highlightedChart === "standings"}
                drivers={data.drivers}
              />
            </div>

            {/* Circuit Visualization */}
            <CircuitVisualization 
              highlighted={highlightedChart === "circuit"}
              drivers={data.drivers}
              session={data.session}
            />

            {/* Charts Row 2 - Stack on mobile */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <GapChart 
                highlighted={highlightedChart === "gap"}
                drivers={data.drivers}
              />
              <TyreStrategy highlighted={highlightedChart === "tyre"} />
            </div>
          </div>
        </main>

        {/* Desktop: AI Chat Panel in sidebar */}
        <aside className="hidden lg:block w-96 xl:w-[420px] border-l border-border">
          <AIChatPanel 
            onHighlightChart={setHighlightedChart}
            session={data.session}
            isLive={isLive}
          />
        </aside>

        {/* Mobile: Floating Chat Button */}
        <button
          onClick={() => setShowMobileChat(true)}
          className="lg:hidden fixed bottom-4 right-4 z-40 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Mobile: Full-screen Chat Panel */}
        {showMobileChat && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              {/* Mobile chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <span className="text-sm font-semibold">Race Intelligence AI</span>
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Chat content */}
              <div className="flex-1 min-h-0">
                <AIChatPanel 
                  onHighlightChart={(chart) => {
                    setHighlightedChart(chart);
                    setShowMobileChat(false);
                  }}
                  session={data.session}
                  isLive={isLive}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
