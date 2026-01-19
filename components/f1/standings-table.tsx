"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface Driver {
  number: number;
  code: string;
  name: string;
  team: string;
  position: number;
  gap: string;
  intervalToNext: number | null;
}

interface StandingsTableProps {
  highlighted?: boolean;
  drivers?: Driver[];
}

const defaultDrivers = [
  { number: 1, code: "VER", name: "M. Verstappen", team: "Red Bull Racing", position: 1, gap: "LEADER", intervalToNext: null },
  { number: 44, code: "HAM", name: "L. Hamilton", team: "Mercedes", position: 2, gap: "+2.345", intervalToNext: 2.345 },
  { number: 16, code: "LEC", name: "C. Leclerc", team: "Ferrari", position: 3, gap: "+5.678", intervalToNext: 3.333 },
  { number: 4, code: "NOR", name: "L. Norris", team: "McLaren", position: 4, gap: "+8.901", intervalToNext: 3.223 },
  { number: 55, code: "SAI", name: "C. Sainz", team: "Ferrari", position: 5, gap: "+12.345", intervalToNext: 3.444 },
  { number: 81, code: "PIA", name: "O. Piastri", team: "McLaren", position: 6, gap: "+15.678", intervalToNext: 3.333 },
  { number: 63, code: "RUS", name: "G. Russell", team: "Mercedes", position: 7, gap: "+18.901", intervalToNext: 3.223 },
  { number: 11, code: "PER", name: "S. Perez", team: "Red Bull Racing", position: 8, gap: "+22.345", intervalToNext: 3.444 },
];

export function StandingsTable({ highlighted = false, drivers = defaultDrivers }: StandingsTableProps) {
  const standings = drivers.slice(0, 8);
  return (
    <div
      className={`bg-card rounded-xl p-3 sm:p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-2 shadow-lg shadow-chart-2/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Live Standings
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            Lap 42 of 78
          </p>
        </div>
        {/* Tyre legend - Compact on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-f1-soft" />
            <span className="text-muted-foreground">S</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-f1-medium" />
            <span className="text-muted-foreground">M</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-f1-hard" />
            <span className="text-muted-foreground">H</span>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-hidden -mx-1 sm:mx-0">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] sm:text-xs text-muted-foreground border-b border-border">
              <th className="text-left py-1.5 sm:py-2 px-1 sm:px-0 font-medium w-8 sm:w-auto">P</th>
              <th className="text-left py-1.5 sm:py-2 font-medium">DRIVER</th>
              <th className="text-right py-1.5 sm:py-2 font-medium">GAP</th>
              <th className="text-center py-1.5 sm:py-2 font-medium w-8 sm:w-auto">T</th>
              <th className="text-center py-1.5 sm:py-2 font-medium w-6 sm:w-8" />
            </tr>
          </thead>
          <tbody>
            {standings.map((driver, idx) => (
              <tr
                key={driver.code}
                className={`text-xs sm:text-sm border-b border-border/50 transition-colors hover:bg-secondary/30 active:bg-secondary/50 ${
                  idx === 0 ? "bg-secondary/20" : ""
                }`}
              >
                <td className="py-2 sm:py-2.5 px-1 sm:px-0 font-mono font-bold text-foreground">
                  {driver.position}
                </td>
                <td className="py-2 sm:py-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-medium text-foreground">{driver.code}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px] sm:max-w-none hidden xs:inline">
                      {driver.team}
                    </span>
                  </div>
                </td>
                <td className="py-2 sm:py-2.5 text-right font-mono text-[10px] sm:text-xs text-muted-foreground">
                  {driver.position === 1 ? 'LDR' : driver.gap}
                </td>
                <td className="py-2 sm:py-2.5">
                  <div className="flex justify-center">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-f1-medium" />
                  </div>
                </td>
                <td className="py-2 sm:py-2.5">
                  <div className="flex justify-center">
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
