"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultGapData = [
  { lap: 1, gap: 0 },
  { lap: 5, gap: 0.8 },
  { lap: 10, gap: 1.5 },
  { lap: 15, gap: 2.1 },
  { lap: 20, gap: 1.8 },
  { lap: 25, gap: 2.3 },
  { lap: 30, gap: 2.8 },
  { lap: 35, gap: 3.2 },
  { lap: 40, gap: 2.5 },
  { lap: 42, gap: 2.345 },
];

interface Driver {
  number: number;
  code: string;
  name: string;
  position: number;
  gap: string;
}

interface GapChartProps {
  highlighted?: boolean;
  drivers?: Driver[];
}

export function GapChart({ highlighted = false, drivers }: GapChartProps) {
  const gapData = defaultGapData;
  
  // Get P1 and P2 drivers
  const p1 = drivers?.find(d => d.position === 1);
  const p2 = drivers?.find(d => d.position === 2);
  
  // Parse gap value (remove '+' and convert to number)
  const currentGap = p2?.gap && p2.gap !== 'LEADER' 
    ? parseFloat(p2.gap.replace('+', '')) 
    : 2.345;
  return (
    <div
      className={`bg-card rounded-xl p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-3 shadow-lg shadow-chart-3/20"
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Gap to Leader
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {p2?.code || 'HAM'} vs {p1?.code || 'VER'} interval
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-foreground">
            +{currentGap.toFixed(3)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">sec</span>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={gapData}>
            <defs>
              <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => [`+${value.toFixed(3)}s`, "Gap"]}
              labelFormatter={(label) => `Lap ${label}`}
            />
            <Area
              type="monotone"
              dataKey="gap"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gapGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
