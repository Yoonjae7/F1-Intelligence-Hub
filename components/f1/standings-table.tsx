"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const standings = [
  {
    pos: 1,
    driver: "M. Verstappen",
    team: "Red Bull Racing",
    time: "1:23:45.678",
    gap: "LEADER",
    tyre: "hard",
    change: 0,
  },
  {
    pos: 2,
    driver: "L. Hamilton",
    team: "Mercedes",
    time: "+2.345",
    gap: "+2.345",
    tyre: "medium",
    change: 1,
  },
  {
    pos: 3,
    driver: "C. Leclerc",
    team: "Ferrari",
    time: "+5.678",
    gap: "+3.333",
    tyre: "soft",
    change: -1,
  },
  {
    pos: 4,
    driver: "L. Norris",
    team: "McLaren",
    time: "+8.901",
    gap: "+3.223",
    tyre: "medium",
    change: 2,
  },
  {
    pos: 5,
    driver: "C. Sainz",
    team: "Ferrari",
    time: "+12.345",
    gap: "+3.444",
    tyre: "hard",
    change: 0,
  },
  {
    pos: 6,
    driver: "O. Piastri",
    team: "McLaren",
    time: "+15.678",
    gap: "+3.333",
    tyre: "medium",
    change: -2,
  },
  {
    pos: 7,
    driver: "G. Russell",
    team: "Mercedes",
    time: "+18.901",
    gap: "+3.223",
    tyre: "soft",
    change: 1,
  },
  {
    pos: 8,
    driver: "S. Perez",
    team: "Red Bull Racing",
    time: "+22.345",
    gap: "+3.444",
    tyre: "hard",
    change: -1,
  },
];

const tyreColors: Record<string, string> = {
  soft: "bg-f1-soft",
  medium: "bg-f1-medium",
  hard: "bg-f1-hard",
};

interface StandingsTableProps {
  highlighted?: boolean;
}

export function StandingsTable({ highlighted = false }: StandingsTableProps) {
  return (
    <div
      className={`bg-card rounded-xl p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-2 shadow-lg shadow-chart-2/20"
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Live Standings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lap 42 of 78
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-f1-soft" />
            <span className="text-muted-foreground">Soft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-f1-medium" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-f1-hard" />
            <span className="text-muted-foreground">Hard</span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">POS</th>
              <th className="text-left py-2 font-medium">DRIVER</th>
              <th className="text-left py-2 font-medium hidden sm:table-cell">TEAM</th>
              <th className="text-right py-2 font-medium">GAP</th>
              <th className="text-center py-2 font-medium">TYRE</th>
              <th className="text-center py-2 font-medium w-8" />
            </tr>
          </thead>
          <tbody>
            {standings.map((driver, idx) => (
              <tr
                key={driver.driver}
                className={`text-sm border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                  idx === 0 ? "bg-secondary/20" : ""
                }`}
              >
                <td className="py-2.5 font-mono font-bold text-foreground">
                  {driver.pos}
                </td>
                <td className="py-2.5 font-medium text-foreground">
                  {driver.driver}
                </td>
                <td className="py-2.5 text-muted-foreground hidden sm:table-cell">
                  {driver.team}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">
                  {driver.gap}
                </td>
                <td className="py-2.5">
                  <div className="flex justify-center">
                    <span
                      className={`w-4 h-4 rounded-full ${tyreColors[driver.tyre]}`}
                    />
                  </div>
                </td>
                <td className="py-2.5">
                  <div className="flex justify-center">
                    {driver.change > 0 && (
                      <ArrowUp className="h-3 w-3 text-emerald-500" />
                    )}
                    {driver.change < 0 && (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    {driver.change === 0 && (
                      <Minus className="h-3 w-3 text-muted-foreground" />
                    )}
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
