"use client";

import { useState, useEffect, useRef } from "react";
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
  { id: "1", code: "VER", team: "Red Bull", color: "#3671C6", position: 1, speed: 298, lapTime: 72.5 },
  { id: "2", code: "NOR", team: "McLaren", color: "#FF8000", position: 2, speed: 295, lapTime: 73.1 },
  { id: "3", code: "LEC", team: "Ferrari", color: "#E8002D", position: 3, speed: 292, lapTime: 73.4 },
  { id: "4", code: "SAI", team: "Ferrari", color: "#E8002D", position: 4, speed: 290, lapTime: 73.8 },
  { id: "5", code: "HAM", team: "Mercedes", color: "#27F4D2", position: 5, speed: 288, lapTime: 74.2 },
  { id: "6", code: "RUS", team: "Mercedes", color: "#27F4D2", position: 6, speed: 285, lapTime: 74.6 },
];

// Monaco GP Circuit - Realistic path based on actual track layout
// Starting from Sainte Devote, going through Casino, Hairpin, Tunnel, Chicane, etc.
const MONACO_CIRCUIT = `
  M 120,200 
  L 120,180 
  C 120,160 130,140 150,130 
  L 200,110 
  C 230,100 250,90 280,85 
  L 340,80 
  C 370,78 400,80 420,90 
  L 450,105 
  C 470,115 480,130 480,150 
  L 480,170 
  C 480,190 470,210 450,225 
  L 420,245 
  C 400,258 370,265 340,265 
  L 280,262 
  C 250,260 220,255 200,245 
  L 170,230 
  C 150,220 135,210 130,200 
  L 125,195
  C 122,192 120,188 120,200
  Z
`;

// Key corners and sections for labels
const TRACK_SECTIONS = [
  { name: "Sainte Devote", progress: 0.02 },
  { name: "Casino", progress: 0.18 },
  { name: "Mirabeau", progress: 0.28 },
  { name: "Hairpin", progress: 0.38 },
  { name: "Tunnel", progress: 0.52 },
  { name: "Chicane", progress: 0.72 },
  { name: "Tabac", progress: 0.82 },
  { name: "Rascasse", progress: 0.92 },
];

function getPointOnPath(progress: number, pathElement: SVGPathElement | null): { x: number; y: number } {
  if (!pathElement) return { x: 120, y: 200 };
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
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Initialize positions with race gaps
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    displayDrivers.forEach((driver, idx) => {
      // Stagger positions based on race position (leader ahead)
      initial[driver.id] = (0.98 - idx * 0.06 + 1) % 1;
    });
    setDriverPositions(initial);
  }, [displayDrivers.length]);

  // Smooth animation with variable speed (slower in corners)
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setDriverPositions((prev) => {
        const next = { ...prev };
        displayDrivers.forEach((driver) => {
          const currentPos = prev[driver.id] || 0;
          
          // Variable speed based on track position (slower in tight sections)
          let speedMultiplier = 1;
          // Slow down at Hairpin (0.35-0.42) and Rascasse (0.90-0.98)
          if ((currentPos > 0.35 && currentPos < 0.42) || (currentPos > 0.90 && currentPos < 0.98)) {
            speedMultiplier = 0.6;
          }
          // Faster through Tunnel (0.50-0.65)
          else if (currentPos > 0.50 && currentPos < 0.65) {
            speedMultiplier = 1.3;
          }
          
          const speedFactor = (72 / driver.lapTime) * speedMultiplier;
          const increment = 0.08 * deltaTime * speedFactor;
          next[driver.id] = (currentPos + increment) % 1;
        });
        return next;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [displayDrivers]);

  const selectedDriverData = selectedDriver 
    ? displayDrivers.find((d) => d.id === selectedDriver) 
    : null;

  return (
    <Card
      className={cn(
        "transition-all duration-500 bg-[#1a1a1f]",
        highlighted && "ring-2 ring-primary shadow-lg shadow-primary/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium text-white">Monaco Grand Prix</CardTitle>
            <span className="text-xs text-white/40 font-mono">Circuit de Monaco</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/40">3.337 km</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="relative bg-[#0f0f12] rounded-xl p-4 overflow-hidden">
          {/* Background grid pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          <svg viewBox="0 0 560 320" className="w-full h-auto relative z-10">
            <defs>
              {/* Track gradient */}
              <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a4a52" />
                <stop offset="50%" stopColor="#3a3a42" />
                <stop offset="100%" stopColor="#4a4a52" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="carGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              {/* Shadow filter */}
              <filter id="trackShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.5"/>
              </filter>
            </defs>

            {/* Track outer edge (barrier) */}
            <path
              d={MONACO_CIRCUIT}
              fill="none"
              stroke="#2a2a30"
              strokeWidth="28"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            
            {/* Track surface */}
            <path
              d={MONACO_CIRCUIT}
              fill="none"
              stroke="url(#trackGradient)"
              strokeWidth="22"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#trackShadow)"
            />
            
            {/* Racing line */}
            <path
              ref={setPathElement}
              d={MONACO_CIRCUIT}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            
            {/* Kerbs at key corners */}
            <KerbMarker pathElement={pathElement} progress={0.02} /> {/* Sainte Devote */}
            <KerbMarker pathElement={pathElement} progress={0.38} /> {/* Hairpin */}
            <KerbMarker pathElement={pathElement} progress={0.72} /> {/* Chicane */}
            <KerbMarker pathElement={pathElement} progress={0.92} /> {/* Rascasse */}

            {/* Start/Finish line */}
            {pathElement && (
              <g>
                <line
                  x1={getPointOnPath(0, pathElement).x - 12}
                  y1={getPointOnPath(0, pathElement).y}
                  x2={getPointOnPath(0, pathElement).x + 12}
                  y2={getPointOnPath(0, pathElement).y}
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.9"
                />
                <CheckeredPattern x={getPointOnPath(0, pathElement).x} y={getPointOnPath(0, pathElement).y} />
              </g>
            )}

            {/* DRS Zone indicator */}
            <DRSZone pathElement={pathElement} startProgress={0.50} endProgress={0.65} />

            {/* Sector markers */}
            <SectorMarker pathElement={pathElement} progress={0.33} label="S1" />
            <SectorMarker pathElement={pathElement} progress={0.66} label="S2" />

            {/* Driver cars */}
            {displayDrivers.map((driver, idx) => {
              const pos = getPointOnPath(driverPositions[driver.id] || 0, pathElement);
              const isSelected = selectedDriver === driver.id;
              const zIndex = displayDrivers.length - idx;
              
              return (
                <g
                  key={driver.id}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className="cursor-pointer transition-transform"
                  style={{ zIndex }}
                >
                  {/* Car shadow */}
                  <ellipse
                    cx={pos.x + 1}
                    cy={pos.y + 3}
                    rx={isSelected ? 7 : 5}
                    ry={isSelected ? 3 : 2}
                    fill="rgba(0,0,0,0.4)"
                  />
                  
                  {/* Selection glow */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill={driver.color}
                      opacity="0.25"
                      filter="url(#carGlow)"
                    />
                  )}
                  
                  {/* Outer ring for selected */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="10"
                      fill="none"
                      stroke={driver.color}
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}
                  
                  {/* Car dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 6 : 4.5}
                    fill={driver.color}
                  />
                  
                  {/* 3D highlight */}
                  <circle
                    cx={pos.x - 1.5}
                    cy={pos.y - 1.5}
                    r={isSelected ? 2 : 1.5}
                    fill="rgba(255,255,255,0.5)"
                  />
                  
                  {/* Position number inside dot for leader */}
                  {driver.position === 1 && (
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      fill="white"
                      fontSize="5"
                      fontWeight="bold"
                    >
                      1
                    </text>
                  )}
                  
                  {/* Driver code label */}
                  <g transform={`translate(${pos.x}, ${pos.y - 14})`}>
                    <rect
                      x="-12"
                      y="-6"
                      width="24"
                      height="12"
                      rx="3"
                      fill="rgba(0,0,0,0.7)"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="white"
                      fontSize="7"
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {driver.code}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Corner names on hover */}
            {TRACK_SECTIONS.map((section) => {
              const pos = getPointOnPath(section.progress, pathElement);
              return (
                <g key={section.name}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="8"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSection(section.name)}
                    onMouseLeave={() => setHoveredSection(null)}
                  />
                  {hoveredSection === section.name && (
                    <g transform={`translate(${pos.x}, ${pos.y + 20})`}>
                      <rect
                        x="-35"
                        y="-8"
                        width="70"
                        height="16"
                        rx="4"
                        fill="rgba(0,0,0,0.85)"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="white"
                        fontSize="8"
                      >
                        {section.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Telemetry Panel */}
          {selectedDriverData && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: selectedDriverData.color }}
                  >
                    P{selectedDriverData.position}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{selectedDriverData.code}</div>
                    <div className="text-xs text-white/50">{selectedDriverData.team}</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-xl font-mono font-bold text-cyan-400">{selectedDriverData.speed}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wide">km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-mono font-bold text-purple-400">
                      {formatLapTime(selectedDriverData.lapTime)}
                    </div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wide">best lap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-mono font-bold text-emerald-400">
                      {selectedDriverData.position === 1 ? 'LEADER' : `+${((selectedDriverData.position - 1) * 1.2).toFixed(1)}s`}
                    </div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wide">gap</div>
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
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border",
                selectedDriver === driver.id
                  ? "bg-white/10 border-white/30"
                  : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/15"
              )}
            >
              <span 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: driver.color }} 
              />
              <span className="font-mono font-semibold text-white">{driver.code}</span>
              <span className="text-white/40">P{driver.position}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Kerb marker component
function KerbMarker({ pathElement, progress }: { pathElement: SVGPathElement | null; progress: number }) {
  const pos = getPointOnPath(progress, pathElement);
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r="4" fill="#E8002D" opacity="0.6" />
      <circle cx={pos.x} cy={pos.y} r="2" fill="white" opacity="0.8" />
    </g>
  );
}

// Checkered flag pattern
function CheckeredPattern({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 15}, ${y - 20})`}>
      {[0, 1, 2, 3, 4].map((row) => (
        [0, 1, 2, 3, 4, 5].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 3}
            y={row * 3}
            width="3"
            height="3"
            fill={(row + col) % 2 === 0 ? "white" : "black"}
            opacity="0.7"
          />
        ))
      ))}
    </g>
  );
}

// DRS Zone indicator
function DRSZone({ pathElement, startProgress, endProgress }: { 
  pathElement: SVGPathElement | null; 
  startProgress: number; 
  endProgress: number;
}) {
  const start = getPointOnPath(startProgress, pathElement);
  const end = getPointOnPath(endProgress, pathElement);
  
  return (
    <g opacity="0.4">
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 4"
      />
      <text
        x={(start.x + end.x) / 2}
        y={(start.y + end.y) / 2 - 15}
        textAnchor="middle"
        fill="#22c55e"
        fontSize="8"
        fontWeight="bold"
      >
        DRS
      </text>
    </g>
  );
}

// Sector marker
function SectorMarker({ pathElement, progress, label }: { 
  pathElement: SVGPathElement | null; 
  progress: number; 
  label: string;
}) {
  const pos = getPointOnPath(progress, pathElement);
  return (
    <g>
      <line
        x1={pos.x - 8}
        y1={pos.y}
        x2={pos.x + 8}
        y2={pos.y}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
      />
      <text
        x={pos.x}
        y={pos.y + 18}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize="9"
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
    'Mercedes': '#27F4D2',
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


