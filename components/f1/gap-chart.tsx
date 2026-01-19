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
  
  const p1 = drivers?.find(d => d.position === 1);
  const p2 = drivers?.find(d => d.position === 2);
  
  const currentGap = p2?.gap && p2.gap !== 'LEADER' 
    ? (typeof p2.gap === 'string' ? parseFloat(p2.gap.replace('+', '')) : parseFloat(p2.gap as any))
    : 2.345;
    
  return (
    <div
      className={`bg-card rounded-xl p-3 sm:p-5 border transition-all duration-500 ${
        highlighted
          ? "border-chart-3 shadow-lg shadow-chart-3/20"
          : "border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            Gap to Leader
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
            {p2?.code || 'P2'} vs {p1?.code || 'P1'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-lg sm:text-xl font-mono font-bold text-foreground">
            +{currentGap.toFixed(3)}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">s</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-40 sm:h-48 -mx-2 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={gapData} margin={{ left: -10, right: 5 }}>
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
              fontSize={9}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "11px",
                padding: "8px 12px",
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
