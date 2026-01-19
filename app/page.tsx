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
import { useF1Data } from "@/hooks/use-f1-data";
import { demoData } from "@/lib/demo-data";

export default function F1IntelligenceHub() {
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);
  const { data: liveData, loading, error, isLive } = useF1Data({ refreshInterval: 10000 });
  
  // Use live data if available, otherwise fall back to demo data
  const data = liveData || demoData;

  useEffect(() => {
    if (highlightedChart) {
      const timer = setTimeout(() => {
        setHighlightedChart(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedChart]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLive={isLive} 
        session={data.session} 
        loading={loading}
      />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)]">
        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
            {/* Loading/Error State */}
            {loading && !data && (
              <div className="text-center py-8 text-muted-foreground">
                Loading F1 data...
              </div>
            )}
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 text-sm text-destructive">
                Unable to load live data. Showing demo data. Error: {error}
              </div>
            )}

            {/* Quick Stats */}
            <StatCards weather={data.weather} />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
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
            />

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <GapChart 
                highlighted={highlightedChart === "gap"}
                drivers={data.drivers}
              />
              <TyreStrategy highlighted={highlightedChart === "tyre"} />
            </div>
          </div>
        </main>

        {/* AI Chat Panel */}
        <aside className="w-full lg:w-96 xl:w-[420px] border-t lg:border-t-0 lg:border-l border-border h-[400px] lg:h-auto">
          <AIChatPanel 
            onHighlightChart={setHighlightedChart}
            session={data.session}
            isLive={isLive}
          />
        </aside>
      </div>
    </div>
  );
}
