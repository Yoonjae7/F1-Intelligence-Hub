"use client";

import { useState, useEffect, useCallback } from "react";
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
  currentLap: number;
}

const defaultDrivers: Driver[] = [
  { id: "1", code: "VER", team: "Red Bull", color: "#3B82F6", position: 1, speed: 298, lapTime: 72.5, currentLap: 45 },
  { id: "2", code: "NOR", team: "McLaren", color: "#F97316", position: 2, speed: 295, lapTime: 73.1, currentLap: 45 },
  { id: "3", code: "LEC", team: "Ferrari", color: "#E8002D", position: 3, speed: 292, lapTime: 73.4, currentLap: 45 },
  { id: "4", code: "SAI", team: "Ferrari", color: "#E8002D", position: 4, speed: 290, lapTime: 73.8, currentLap: 45 },
  { id: "5", code: "HAM", team: "Mercedes", color: "#00D2BE", position: 5, speed: 288, lapTime: 74.2, currentLap: 45 },
  { id: "6", code: "RUS", team: "Mercedes", color: "#00D2BE", position: 6, speed: 285, lapTime: 74.6, currentLap: 45 },
];

// Monaco GP circuit path - refined
const CIRCUIT_PATH = "M 50,180 C 80,180 100,160 120,140 C 140,120 180,100 220,100 C 260,100 300,80 340,60 C 380,40 420,40 460,60 C 500,80 520,120 520,160 C 520,200 500,240 460,260 C 420,280 380,280 340,260 C 300,240 260,220 220,220 C 180,220 140,240 100,260 C 60,280 40,260 30,220 C 20,180 30,160 50,180";

// Get point and angle on path
function getPointOnPath(progress: number, pathElement: SVGPathElement | null): { x: number; y: number; angle: number } {
  if (!pathElement) return { x: 50, y: 180, angle: 0 };
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(progress * length);
  
  // Calculate angle by getting a point slightly ahead
  const nextProgress = Math.min(progress + 0.01, 1);
  const nextPoint = pathElement.getPointAtLength(nextProgress * length);
  const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
  
  return { x: point.x, y: point.y, angle };
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

// F1 Car SVG Component - Simple refined shape
function F1Car({ color, isSelected }: { color: string; isSelected: boolean }) {
  return (
    <g>
      {/* Glow effect when selected */}
      {isSelected && (
        <ellipse cx="0" cy="0" rx="18" ry="10" fill={color} opacity="0.4" filter="url(#carGlow)" />
      )}
      
      {/* Car body - streamlined F1 silhouette */}
      <path
        d="M -12 0 L -10 -3 L -6 -4 L 0 -4 L 8 -3 L 12 0 L 8 3 L 0 4 L -6 4 L -10 3 Z"
        fill={color}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
      
      {/* Front wing */}
      <path
        d="M 10 -5 L 14 -5 L 14 -3 L 10 -3 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M 10 3 L 14 3 L 14 5 L 10 5 Z"
        fill={color}
        opacity="0.9"
      />
      
      {/* Rear wing */}
      <rect x="-14" y="-6" width="3" height="12" fill={color} opacity="0.9" rx="0.5" />
      
      {/* Wheels */}
      <ellipse cx="6" cy="-4.5" rx="2" ry="1.5" fill="#1a1a1a" />
      <ellipse cx="6" cy="4.5" rx="2" ry="1.5" fill="#1a1a1a" />
      <ellipse cx="-6" cy="-4.5" rx="2" ry="1.5" fill="#1a1a1a" />
      <ellipse cx="-6" cy="4.5" rx="2" ry="1.5" fill="#1a1a1a" />
      
      {/* Cockpit */}
      <ellipse cx="2" cy="0" rx="3" ry="2" fill="rgba(0,0,0,0.6)" />
      
      {/* Helmet highlight */}
      <circle cx="2" cy="0" r="1.2" fill={isSelected ? "white" : "rgba(255,255,255,0.5)"} />
    </g>
  );
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
        currentLap: 45,
      }))
    : defaultDrivers;

  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [driverPositions, setDriverPositions] = useState<{ [key: string]: number }>({});
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Initialize driver positions
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    displayDrivers.forEach((driver, idx) => {
      initial[driver.id] = (1 - idx * 0.08) % 1;
    });
    setDriverPositions(initial);
  }, [displayDrivers.length]);

  // Smooth animation loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setDriverPositions((prev) => {
        const next = { ...prev };
        displayDrivers.forEach((driver) => {
          const speedFactor = 72 / driver.lapTime;
          const increment = 0.15 * deltaTime * speedFactor; // Smooth movement
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
          <svg viewBox="0 0 560 320" className="w-full h-auto">
            {/* Definitions */}
            <defs>
              {/* Glow filter for selected car */}
              <filter id="carGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              {/* Track texture gradient */}
              <linearGradient id="trackSurface" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="50%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>
              
              {/* Kerb pattern */}
              <pattern id="kerbPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="4" height="8" fill="#E8002D" />
                <rect x="4" width="4" height="8" fill="#FFFFFF" />
              </pattern>
            </defs>

            {/* Track shadow */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(2, 2)"
            />

            {/* Track outline (kerbs) */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="url(#kerbPattern)"
              strokeWidth="26"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />

            {/* Main track surface */}
            <path
              d={CIRCUIT_PATH}
              fill="none"
              stroke="url(#trackSurface)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Racing line */}
            <path
              ref={setPathElement}
              d={CIRCUIT_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="8 4"
            />

            {/* Track markings - start/finish */}
            {pathElement && (
              <g>
                <rect
                  x={getPointOnPath(0, pathElement).x - 15}
                  y={getPointOnPath(0, pathElement).y - 12}
                  width="4"
                  height="24"
                  fill="white"
                  opacity="0.8"
                />
                <text
                  x={getPointOnPath(0, pathElement).x - 25}
                  y={getPointOnPath(0, pathElement).y + 4}
                  fill="rgba(255,255,255,0.6)"
                  fontSize="8"
                  fontWeight="bold"
                >
                  S/F
                </text>
              </g>
            )}

            {/* Sector markers */}
            <SectorMarker progress={0.33} label="S1" pathElement={pathElement} />
            <SectorMarker progress={0.66} label="S2" pathElement={pathElement} />

            {/* F1 Cars */}
            {displayDrivers.map((driver) => {
              const { x, y, angle } = getPointOnPath(driverPositions[driver.id] || 0, pathElement);
              const isSelected = selectedDriver === driver.id;
              
              return (
                <g
                  key={driver.id}
                  transform={`translate(${x}, ${y}) rotate(${angle})`}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className="cursor-pointer"
                  style={{ transition: 'transform 0.05s linear' }}
                >
                  {/* Trail effect */}
                  <ellipse cx="-18" cy="0" rx="4" ry="2" fill={driver.color} opacity="0.2" />
                  <ellipse cx="-24" cy="0" rx="3" ry="1.5" fill={driver.color} opacity="0.1" />
                  
                  {/* F1 Car */}
                  <F1Car color={driver.color} isSelected={isSelected} />
                  
                  {/* Driver code label */}
                  <text
                    x="0"
                    y="-14"
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    className="font-mono"
                    style={{ 
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      transform: `rotate(${-angle}deg)`,
                      transformOrigin: '0 -14px'
                    }}
                  >
                    {driver.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Telemetry Panel */}
          {selectedDriverData && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1.5 rounded-full" style={{ backgroundColor: selectedDriverData.color }} />
                  <div>
                    <div className="text-sm font-bold text-white">{selectedDriverData.code}</div>
                    <div className="text-xs text-white/60">{selectedDriverData.team}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-xl font-mono font-bold text-cyan-400">{selectedDriverData.speed}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">km/h</div>
                  </div>
                  <div>
                    <div className="text-xl font-mono font-bold text-white">P{selectedDriverData.position}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Position</div>
                  </div>
                  <div>
                    <div className="text-xl font-mono font-bold text-green-400">
                      {formatLapTime(selectedDriverData.lapTime)}
                    </div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">Lap Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {displayDrivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all border",
                selectedDriver === driver.id
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20"
              )}
            >
              <span 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: driver.color }} 
              />
              <span className="font-mono font-semibold">{driver.code}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SectorMarker({ progress, label, pathElement }: { progress: number; label: string; pathElement: SVGPathElement | null }) {
  const { x, y } = getPointOnPath(progress, pathElement);
  return (
    <g>
      <circle cx={x} cy={y} r="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text
        x={x}
        y={y + 14}
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="7"
        fontWeight="500"
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
