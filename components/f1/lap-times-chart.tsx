"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultLapData = [
  { lap: 1, VER: 78.2, HAM: 78.5, LEC: 78.8, NOR: 79.1 },
  { lap: 2, VER: 77.8, HAM: 77.9, LEC: 78.1, NOR: 78.3 },
  { lap: 3, VER: 77.5, HAM: 77.7, LEC: 77.9, NOR: 78.0 },
  { lap: 4, VER: 77.3, HAM: 77.5, LEC: 77.8, NOR: 77.9 },
  { lap: 5, VER: 77.2, HAM: 77.4, LEC: 77.6, NOR: 77.8 },
  { lap: 6, VER: 77.1, HAM: 77.3, LEC: 77.5, NOR: 77.7 },
  { lap: 7, VER: 77.0, HAM: 77.2, LEC: 77.4, NOR: 77.6 },
  { lap: 8, VER: 76.9, HAM: 77.1, LEC: 77.3, NOR: 77.5 },
  { lap: 9, VER: 76.8, HAM: 77.0, LEC: 77.2, NOR: 77.4 },
  { lap: 10, VER: 76.7, HAM: 76.9, LEC: 77.1, NOR: 77.3 },
  { lap: 11, VER: 76.6, HAM: 76.8, LEC: 77.0, NOR: 77.2 },
  { lap: 12, VER: 76.5, HAM: 76.7, LEC: 76.9, NOR: 77.1 },
];

interface LapTimesChartProps {
  highlighted?: boolean;
  lapData?: any[];
}

export function LapTimesChart({ highlighted = false, lapData = defaultLapData }: LapTimesChartProps) {
  const driverKeys = lapData.length > 0 
    ? Object.keys(lapData[0]).filter(key => key !== 'lap')
    : ['VER', 'HAM', 'LEC', 'NOR'];
  
  const drivers = driverKeys.map(key => ({
    key,
    name: key,
    color: getDriverColor(key)
  }));
  
  function getDriverColor(code: string): string {
    // 19 clearly distinct colors for all drivers
    const colors: Record<string, string> = {
      'VER': '#0066FF',  // Blue
      'HAM': '#00AA00',  // Green
      'LEC': '#FF0000',  // Red
      'NOR': '#FF6600',  // Orange
      'SAI': '#FFD700',  // Yellow
      'PIA': '#FF1493',  // Pink
      'RUS': '#00DDDD',  // Cyan
      'PER': '#9933FF',  // Purple
      'ALO': '#CCFF00',  // Lime
      'STR': '#008080',  // Teal
      'GAS': '#FF00AA',  // Magenta
      'OCO': '#40E0D0',  // Turquoise
      'HUL': '#FFB000',  // Gold
      'TSU': '#DC143C',  // Crimson
      'RIC': '#8B4513',  // Brown
      'MAG': '#9966CC',  // Lavender
      'ALB': '#000080',  // Navy
      'SAR': '#FF7F50',  // Coral
      'BOT': '#66FFAA',  // Mint
      'ZHO': '#FF1493',  // Pink (alternate)
    };
    return colors[code] || '#FFFFFF';
  }
  
  // Always start with top 4 drivers visible (VER, HAM, LEC, NOR are most common)
  const [activeDrivers, setActiveDrivers] = useState<string[]>(['VER', 'HAM', 'LEC', 'NOR']);

  const toggleDriver = (key: string) => {
    setActiveDrivers((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  return (
    <div
      className={`bg-card rounded-xl p-3 sm:p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-1 shadow-lg shadow-chart-1/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Lap Times</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Tap to toggle • {activeDrivers.length} of {drivers.length} visible
            </p>
          </div>
          {/* Show All / Hide All buttons */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveDrivers(drivers.map(d => d.key))}
              className="text-[9px] sm:text-[10px] px-2 py-1 rounded bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveDrivers([])}
              className="text-[9px] sm:text-[10px] px-2 py-1 rounded bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              None
            </button>
          </div>
        </div>
        
        {/* Driver toggles - Wrap to show all */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {drivers.map((driver) => {
            const isActive = activeDrivers.includes(driver.key);
            return (
              <button
                key={driver.key}
                type="button"
                onClick={() => toggleDriver(driver.key)}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[11px] font-bold transition-all active:scale-95 ${
                  isActive
                    ? "text-white"
                    : "bg-muted/30 text-muted-foreground opacity-50 hover:opacity-100"
                }`}
                style={isActive ? { backgroundColor: driver.color } : undefined}
              >
                {driver.key}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Chart - Smaller on mobile */}
      <div className="h-48 sm:h-64 -mx-2 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lapData} margin={{ left: -10, right: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="lap"
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[76, 80]}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "11px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`${value.toFixed(3)}s`]}
              labelFormatter={(label) => `Lap ${label}`}
            />
            {drivers.map(
              (driver) =>
                activeDrivers.includes(driver.key) && (
                  <Line
                    key={driver.key}
                    type="monotone"
                    dataKey={driver.key}
                    stroke={driver.color}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: driver.color }}
                    opacity={0.9}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
