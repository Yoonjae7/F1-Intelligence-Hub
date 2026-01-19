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
  Legend,
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
  // Extract driver codes from lap data
  const driverKeys = lapData.length > 0 
    ? Object.keys(lapData[0]).filter(key => key !== 'lap')
    : ['VER', 'HAM', 'LEC', 'NOR'];
  
  const drivers = driverKeys.map(key => ({
    key,
    name: key,
    color: getDriverColor(key)
  }));
  
  function getDriverColor(code: string): string {
    const colors: Record<string, string> = {
      'VER': '#3b82f6', 'HAM': '#22c55e', 'LEC': '#ef4444', 'NOR': '#f97316',
      'SAI': '#ef4444', 'PIA': '#f97316', 'RUS': '#22c55e', 'PER': '#3b82f6',
    };
    return colors[code] || '#ffffff';
  }
  const [activeDrivers, setActiveDrivers] = useState<string[]>(
    drivers.map((d) => d.key)
  );

  const toggleDriver = (key: string) => {
    setActiveDrivers((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  return (
    <div
      className={`bg-card rounded-xl p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-1 shadow-lg shadow-chart-1/20"
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Lap Times</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sector performance analysis
          </p>
        </div>
        <div className="flex gap-2">
          {drivers.map((driver) => (
            <button
              key={driver.key}
              type="button"
              onClick={() => toggleDriver(driver.key)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all ${
                activeDrivers.includes(driver.key)
                  ? "bg-secondary text-foreground"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: driver.color }}
              />
              {driver.key}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lapData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="lap"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[76, 80]}
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
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
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
