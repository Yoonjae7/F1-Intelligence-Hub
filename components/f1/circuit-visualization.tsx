"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Driver {
  id: string;
  code: string;
  team: string;
  color: string;
  position: number;
  speed: number; // km/h current speed
  lapTime: number; // seconds for full lap
  currentLap: number;
}

const drivers: Driver[] = [
  { id: "1", code: "VER", team: "Red Bull", color: "#3B82F6", position: 1, speed: 298, lapTime: 72.5, currentLap: 45 },
  { id: "2", code: "NOR", team: "McLaren", color: "#F97316", position: 2, speed: 295, lapTime: 73.1, currentLap: 45 },
  { id: "3", code: "LEC", team: "Ferrari", color: "#EF4444", position: 3, speed: 292, lapTime: 73.4, currentLap: 45 },
  { id: "4", code: "SAI", team: "Ferrari", color: "#EF4444", position: 4, speed: 290, lapTime: 73.8, currentLap: 45 },
  { id: "5", code: "HAM", team: "Mercedes", color: "#06B6D4", position: 5, speed: 288, lapTime: 74.2, currentLap: 45 },
  { id: "6", code: "RUS", team: "Mercedes", color: "#06B6D4", position: 6, speed: 285, lapTime: 74.6, currentLap: 45 },
];

// Monaco GP circuit path (simplified representation)
const CIRCUIT_PATH = "M 50,180 C 80,180 100,160 120,140 C 140,120 180,100 220,100 C 260,100 300,80 340,60 C 380,40 420,40 460,60 C 500,80 520,120 520,160 C 520,200 500,240 460,260 C 420,280 380,280 340,260 C 300,240 260,220 220,220 C 180,220 140,240 100,260 C 60,280 40,260 30,220 C 20,180 30,160 50,180";

// Calculate point on path at given progress (0-1)
function getPointOnPath(progress: number, pathElement: SVGPathElement | null): { x: number; y: number } {
  if (!pathElement) return { x: 50, y: 180 };
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(progress * length);
  return { x: point.x, y: point.y };
}

interface CircuitVisualizationProps {
  highlighted?: boolean;
}

export function CircuitVisualization({ highlighted }: CircuitVisualizationProps) {
  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [driverPositions, setDriverPositions] = useState<{ [key: string]: number }>({});
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  // Initialize driver positions with offsets based on their race position
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    drivers.forEach((driver, idx) => {
      // Stagger start positions based on race position
      initial[driver.id] = (1 - idx * 0.08) % 1;
    });
    setDriverPositions(initial);
  }, []);

  // Animate cars around the track
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
      setDriverPositions((prev) => {
        const next = { ...prev };
        drivers.forEach((driver) => {
          // Speed determines how fast they move around the track
          // Faster lap time = faster movement
          const speedFactor = 72 / driver.lapTime; // Relative to fastest theoretical lap
          const increment = 0.003 * speedFactor;
          next[driver.id] = (prev[driver.id] + increment) % 1;
        });
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const selectedDriverData = selectedDriver ? drivers.find((d) => d.id === selectedDriver) : null;

  return (
    <Card
      className={cn(
        "transition-all duration-500",
        highlighted && "ring-2 ring-primary shadow-lg shadow-primary/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Circuit Track</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-f1-green animate-pulse" />
              Live
            </span>
            <span>Monaco GP</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Circuit SVG */}
          <svg viewBox="0 0 560 320" className="w-full h-auto">
            {/* Track background glow */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" />
                <stop offset="100%" stopColor="hsl(var(--border))" />
              </linearGradient>
            </defs>

            {/* Track outline (wider, for visual) */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />

            {/* Track surface */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Racing line */}
            <path
              ref={setPathElement}
              d={CIRCUIT_PATH}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {/* Sector markers */}
            <SectorMarker path={CIRCUIT_PATH} progress={0} label="S1" pathElement={pathElement} />
            <SectorMarker path={CIRCUIT_PATH} progress={0.33} label="S2" pathElement={pathElement} />
            <SectorMarker path={CIRCUIT_PATH} progress={0.66} label="S3" pathElement={pathElement} />

            {/* Start/Finish line */}
            {pathElement && (
              <g>
                <line
                  x1={getPointOnPath(0, pathElement).x - 10}
                  y1={getPointOnPath(0, pathElement).y - 10}
                  x2={getPointOnPath(0, pathElement).x + 10}
                  y2={getPointOnPath(0, pathElement).y + 10}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="3"
                />
              </g>
            )}

            {/* Drivers */}
            {drivers.map((driver) => {
              const pos = getPointOnPath(driverPositions[driver.id] || 0, pathElement);
              const isSelected = selectedDriver === driver.id;
              return (
                <g
                  key={driver.id}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className="cursor-pointer"
                >
                  {/* Car glow effect when selected */}
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="14" fill={driver.color} opacity="0.3" filter="url(#glow)" />
                  )}
                  {/* Speed trail effect */}
                  <circle cx={pos.x - 3} cy={pos.y} r="4" fill={driver.color} opacity="0.3" />
                  <circle cx={pos.x - 6} cy={pos.y} r="3" fill={driver.color} opacity="0.15" />
                  {/* Car dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "8" : "6"}
                    fill={driver.color}
                    stroke={isSelected ? "white" : "transparent"}
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  {/* Driver code label */}
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="9"
                    fontWeight="600"
                    className="font-mono"
                  >
                    {driver.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Speed/Telemetry Panel */}
          {selectedDriverData && (
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full" style={{ backgroundColor: selectedDriverData.color }} />
                  <div>
                    <div className="text-sm font-semibold">{selectedDriverData.code}</div>
                    <div className="text-xs text-muted-foreground">{selectedDriverData.team}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-mono font-bold text-f1-cyan">{selectedDriverData.speed}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">km/h</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono font-bold">P{selectedDriverData.position}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Position</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono font-bold text-f1-green">
                      {formatLapTime(selectedDriverData.lapTime)}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Lap Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {drivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all",
                selectedDriver === driver.id
                  ? "bg-secondary ring-1 ring-primary/50"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: driver.color }} />
              <span className="font-mono font-medium">{driver.code}</span>
              <span className="text-muted-foreground">{driver.speed} km/h</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SectorMarker({
  progress,
  label,
  pathElement,
}: {
  path: string;
  progress: number;
  label: string;
  pathElement: SVGPathElement | null;
}) {
  const pos = getPointOnPath(progress, pathElement);
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
      <text
        x={pos.x}
        y={pos.y + 16}
        textAnchor="middle"
        fill="hsl(var(--muted-foreground))"
        fontSize="8"
        className="font-mono"
      >
        {label}
      </text>
    </g>
  );
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, "0")}`;
}
