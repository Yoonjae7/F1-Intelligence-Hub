"use client";

interface Stint {
  compound: "soft" | "medium" | "hard";
  startLap: number;
  endLap: number;
}

interface DriverStrategy {
  driver: string;
  stints: Stint[];
}

// 2024 Abu Dhabi GP tyre strategies (matching demo-data.ts)
const strategies: DriverStrategy[] = [
  {
    driver: "NOR", // Winner
    stints: [
      { compound: "medium", startLap: 1, endLap: 22 },
      { compound: "hard", startLap: 23, endLap: 44 },
      { compound: "soft", startLap: 45, endLap: 58 },
    ],
  },
  {
    driver: "SAI", // P2
    stints: [
      { compound: "medium", startLap: 1, endLap: 20 },
      { compound: "hard", startLap: 21, endLap: 42 },
      { compound: "medium", startLap: 43, endLap: 58 },
    ],
  },
  {
    driver: "LEC", // P3
    stints: [
      { compound: "soft", startLap: 1, endLap: 15 },
      { compound: "hard", startLap: 16, endLap: 40 },
      { compound: "medium", startLap: 41, endLap: 58 },
    ],
  },
  {
    driver: "HAM", // P4
    stints: [
      { compound: "medium", startLap: 1, endLap: 25 },
      { compound: "hard", startLap: 26, endLap: 50 },
      { compound: "soft", startLap: 51, endLap: 58 },
    ],
  },
];

const compoundColors: Record<string, string> = {
  soft: "bg-f1-soft",
  medium: "bg-f1-medium",
  hard: "bg-f1-hard",
};

interface TyreStrategyProps {
  highlighted?: boolean;
}

export function TyreStrategy({ highlighted = false }: TyreStrategyProps) {
  const totalLaps = 58; // 2024 Abu Dhabi GP had 58 laps
  const currentLap = 58; // Show completed race

  return (
    <div
      className={`bg-card rounded-xl p-3 sm:p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-4 shadow-lg shadow-chart-4/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Tyre Strategy
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            2024 Abu Dhabi GP
          </p>
        </div>
        {/* Legend - Compact */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-f1-soft" />
            <span className="text-muted-foreground hidden xs:inline">Soft</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-f1-medium" />
            <span className="text-muted-foreground hidden xs:inline">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-f1-hard" />
            <span className="text-muted-foreground hidden xs:inline">Hard</span>
          </div>
        </div>
      </div>
      
      {/* Strategy timeline */}
      <div className="space-y-2 sm:space-y-3">
        {strategies.map((driver) => (
          <div key={driver.driver} className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-mono font-medium text-muted-foreground w-7 sm:w-8 shrink-0">
              {driver.driver}
            </span>
            <div className="flex-1 h-4 sm:h-5 bg-muted/30 rounded-full overflow-hidden flex relative">
              {driver.stints.map((stint, idx) => {
                const width =
                  ((stint.endLap - stint.startLap + 1) / totalLaps) * 100;
                const left = ((stint.startLap - 1) / totalLaps) * 100;
                return (
                  <div
                    key={`${stint.compound}-${stint.startLap}`}
                    className={`absolute h-full ${compoundColors[stint.compound]} transition-all`}
                    style={{
                      width: `${width}%`,
                      left: `${left}%`,
                      opacity: stint.endLap <= currentLap ? 1 : 0.5,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Lap indicators */}
      <div className="flex justify-between mt-2 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground">
        <span>L1</span>
        <span className="text-foreground font-medium">Finished</span>
        <span>L{totalLaps}</span>
      </div>
    </div>
  );
}
