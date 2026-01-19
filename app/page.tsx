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

export default function F1IntelligenceHub() {
  const [highlightedChart, setHighlightedChart] = useState<string | null>(null);

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
      <Header />
      
      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6">
            {/* Quick Stats */}
            <StatCards />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <LapTimesChart highlighted={highlightedChart === "laptimes"} />
              <StandingsTable highlighted={highlightedChart === "standings"} />
            </div>

            {/* Circuit Visualization */}
            <CircuitVisualization highlighted={highlightedChart === "circuit"} />

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <GapChart highlighted={highlightedChart === "gap"} />
              <TyreStrategy highlighted={highlightedChart === "tyre"} />
            </div>
          </div>
        </main>

        {/* AI Chat Panel */}
        <aside className="w-full lg:w-96 xl:w-[420px] border-t lg:border-t-0 lg:border-l border-border h-[400px] lg:h-auto">
          <AIChatPanel onHighlightChart={setHighlightedChart} />
        </aside>
      </div>
    </div>
  );
}
