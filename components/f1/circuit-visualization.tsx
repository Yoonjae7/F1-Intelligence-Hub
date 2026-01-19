"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Driver {
  id: string;
  code: string;
  team: string;
  color: string;
  position: number;
  speed: number;
  lapTime: number;
}

const defaultDrivers: Driver[] = [
  { id: "1", code: "VER", team: "Red Bull", color: "#3B82F6", position: 1, speed: 298, lapTime: 72.5 },
  { id: "2", code: "NOR", team: "McLaren", color: "#F97316", position: 2, speed: 295, lapTime: 73.1 },
  { id: "3", code: "LEC", team: "Ferrari", color: "#E8002D", position: 3, speed: 292, lapTime: 73.4 },
  { id: "4", code: "SAI", team: "Ferrari", color: "#E8002D", position: 4, speed: 290, lapTime: 73.8 },
  { id: "5", code: "HAM", team: "Mercedes", color: "#00D2BE", position: 5, speed: 288, lapTime: 74.2 },
  { id: "6", code: "RUS", team: "Mercedes", color: "#00D2BE", position: 6, speed: 285, lapTime: 74.6 },
];

// Simple circuit path - will be transformed for 3D perspective
const CIRCUIT_PATH = "M 80,150 L 180,80 L 320,60 L 450,80 L 500,150 L 480,220 L 380,260 L 200,260 L 100,220 Z";

function getPointOnPath(progress: number, pathElement: SVGPathElement | null): { x: number; y: number } {
  if (!pathElement) return { x: 80, y: 150 };
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(progress * length);
  return { x: point.x, y: point.y };
}

interface LiveDriver {
  number: number;
  code: string;
  name: string;
  team: string;
  color: string;
  position: number;
}

interface CircuitVisualizationProps {
  highlighted?: boolean;
  drivers?: LiveDriver[];
}

export function CircuitVisualization({ highlighted, drivers: liveDrivers }: CircuitVisualizationProps) {
  const displayDrivers = liveDrivers && liveDrivers.length > 0 
    ? liveDrivers.slice(0, 6).map((d) => ({
        id: d.number.toString(),
        code: d.code,
        team: d.team,
        color: d.color || getTeamColor(d.team),
        position: d.position,
        speed: 298 - (d.position * 2),
        lapTime: 72 + d.position * 0.3,
      }))
    : defaultDrivers;

  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [driverPositions, setDriverPositions] = useState<{ [key: string]: number }>({});
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Initialize positions
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    displayDrivers.forEach((driver, idx) => {
      initial[driver.id] = (1 - idx * 0.1) % 1;
    });
    setDriverPositions(initial);
  }, [displayDrivers.length]);

  // Animation
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setDriverPositions((prev) => {
        const next = { ...prev };
        displayDrivers.forEach((driver) => {
          const speedFactor = 72 / driver.lapTime;
          const increment = 0.12 * deltaTime * speedFactor;
          next[driver.id] = ((prev[driver.id] || 0) + increment) % 1;
        });
        return next;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [displayDrivers]);

  const selectedDriverData = selectedDriver ? displayDrivers.find((d) => d.id === selectedDriver) : null;

  return (
    <Card
      className={cn(
        "transition-all duration-500 overflow-hidden",
        highlighted && "ring-2 ring-primary shadow-lg shadow-primary/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Circuit Track</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <span>Monaco GP</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="relative"
          style={{
            perspective: '800px',
            perspectiveOrigin: '50% 30%',
          }}
        >
          <svg 
            viewBox="0 0 560 300" 
            className="w-full h-auto"
            style={{
              transform: 'rotateX(55deg) rotateZ(-5deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Ground plane gradient */}
            <defs>
              <linearGradient id="ground3d" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(40,40,45,0.8)" />
                <stop offset="100%" stopColor="rgba(20,20,25,0.9)" />
              </linearGradient>
              <filter id="shadow3d" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="black" floodOpacity="0.5"/>
              </filter>
              <filter id="glow3d" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Ground */}
            <rect x="0" y="0" width="560" height="300" fill="url(#ground3d)" rx="8"/>

            {/* Track shadow */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="14"
              strokeLinejoin="round"
              transform="translate(3, 6)"
            />

            {/* Main track - single clean line */}
            <path
              ref={setPathElement}
              d={CIRCUIT_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinejoin="round"
              filter="url(#shadow3d)"
            />

            {/* Start/Finish marker */}
            {pathElement && (
              <line
                x1={getPointOnPath(0, pathElement).x}
                y1={getPointOnPath(0, pathElement).y - 8}
                x2={getPointOnPath(0, pathElement).x}
                y2={getPointOnPath(0, pathElement).y + 8}
                stroke="white"
                strokeWidth="2"
                opacity="0.6"
              />
            )}

            {/* Driver dots with 3D effect */}
            {displayDrivers.map((driver) => {
              const pos = getPointOnPath(driverPositions[driver.id] || 0, pathElement);
              const isSelected = selectedDriver === driver.id;
              
              return (
                <g
                  key={driver.id}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className="cursor-pointer"
                >
                  {/* Dot shadow */}
                  <ellipse
                    cx={pos.x + 2}
                    cy={pos.y + 4}
                    rx={isSelected ? 8 : 6}
                    ry={isSelected ? 4 : 3}
                    fill="rgba(0,0,0,0.5)"
                  />
                  
                  {/* Glow for selected */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="14"
                      fill={driver.color}
                      opacity="0.3"
                      filter="url(#glow3d)"
                    />
                  )}
                  
                  {/* Main dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 7 : 5}
                    fill={driver.color}
                  />
                  
                  {/* Highlight on dot for 3D sphere effect */}
                  <circle
                    cx={pos.x - 1.5}
                    cy={pos.y - 1.5}
                    r={isSelected ? 2.5 : 1.5}
                    fill="rgba(255,255,255,0.6)"
                  />
                  
                  {/* Driver label */}
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="600"
                    opacity="0.9"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {driver.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Telemetry Panel */}
          {selectedDriverData && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: selectedDriverData.color }}
                  >
                    {selectedDriverData.position}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{selectedDriverData.code}</div>
                    <div className="text-xs text-white/50">{selectedDriverData.team}</div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-cyan-400">{selectedDriverData.speed}</div>
                    <div className="text-[9px] text-white/40 uppercase">km/h</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      {formatLapTime(selectedDriverData.lapTime)}
                    </div>
                    <div className="text-[9px] text-white/40 uppercase">lap time</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {displayDrivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all",
                selectedDriver === driver.id
                  ? "bg-white/15 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
            >
              <span 
                className="h-2.5 w-2.5 rounded-full shadow-lg" 
                style={{ backgroundColor: driver.color }} 
              />
              <span className="font-mono font-medium">{driver.code}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, "0")}`;
}

function getTeamColor(team: string): string {
  const colors: Record<string, string> = {
    'Red Bull': '#3671C6',
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#E8002D',
    'Mercedes': '#00D2BE',
    'McLaren': '#FF8000',
    'Aston Martin': '#229971',
    'Alpine': '#FF87BC',
    'Williams': '#64C4FF',
    'RB': '#6692FF',
    'Kick Sauber': '#52E252',
    'Haas F1 Team': '#B6BABD',
  };
  return colors[team] || '#FFFFFF';
}
