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
  trackProgress: number; // 0-1 representing position on track
}

const defaultDrivers: Driver[] = [
  { id: "1", code: "VER", team: "Red Bull", color: "#3671C6", position: 1, speed: 298, lapTime: 72.5, trackProgress: 0 },
  { id: "2", code: "NOR", team: "McLaren", color: "#FF8000", position: 2, speed: 295, lapTime: 73.1, trackProgress: 0 },
  { id: "3", code: "LEC", team: "Ferrari", color: "#E8002D", position: 3, speed: 292, lapTime: 73.4, trackProgress: 0 },
  { id: "4", code: "SAI", team: "Ferrari", color: "#E8002D", position: 4, speed: 290, lapTime: 73.8, trackProgress: 0 },
  { id: "5", code: "HAM", team: "Mercedes", color: "#27F4D2", position: 5, speed: 288, lapTime: 74.2, trackProgress: 0 },
  { id: "6", code: "RUS", team: "Mercedes", color: "#27F4D2", position: 6, speed: 285, lapTime: 74.6, trackProgress: 0 },
];

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
  session?: {
    name: string;
    location: string;
    country: string;
    circuit: string;
  };
}

export function CircuitVisualization({ highlighted, drivers: liveDrivers, session }: CircuitVisualizationProps) {
  const displayDrivers = liveDrivers && liveDrivers.length > 0 
    ? liveDrivers.slice(0, 8).map((d) => ({
        id: d.number.toString(),
        code: d.code,
        team: d.team,
        color: d.color || getTeamColor(d.team),
        position: d.position,
        speed: 298 - (d.position * 2),
        lapTime: 72 + d.position * 0.3,
        trackProgress: 0,
      }))
    : defaultDrivers;

  const [driverProgress, setDriverProgress] = useState<{ [key: string]: number }>({});
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [currentSector, setCurrentSector] = useState<{ [key: string]: number }>({});

  // Session info
  const circuitName = session?.circuit || session?.location || "Circuit";
  const raceName = session?.name || "Grand Prix";
  const location = session?.location || "Race Track";

  // Initialize positions with race gaps
  useEffect(() => {
    const initial: { [key: string]: number } = {};
    const sectors: { [key: string]: number } = {};
    displayDrivers.forEach((driver, idx) => {
      // Stagger positions - leader at front
      initial[driver.id] = (0.95 - idx * 0.05 + 1) % 1;
      sectors[driver.id] = Math.floor(initial[driver.id] * 3) + 1;
    });
    setDriverProgress(initial);
    setCurrentSector(sectors);
  }, [displayDrivers.length]);

  // Animation
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setDriverProgress((prev) => {
        const next = { ...prev };
        const newSectors: { [key: string]: number } = {};
        
        displayDrivers.forEach((driver) => {
          const speedFactor = (72 / driver.lapTime);
          const increment = 0.06 * deltaTime * speedFactor;
          const newProgress = ((prev[driver.id] || 0) + increment) % 1;
          next[driver.id] = newProgress;
          newSectors[driver.id] = Math.floor(newProgress * 3) + 1;
        });
        
        setCurrentSector(newSectors);
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

  // Sort drivers by track position for display
  const sortedByTrackPos = [...displayDrivers].sort((a, b) => {
    const posA = driverProgress[a.id] || 0;
    const posB = driverProgress[b.id] || 0;
    return posB - posA;
  });

  return (
    <Card
      className={cn(
        "transition-all duration-500 bg-[#0a0a0c]",
        highlighted && "ring-2 ring-primary shadow-lg shadow-primary/20"
      )}
    >
      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-white">{location} {raceName}</CardTitle>
            <p className="text-xs text-white/40 mt-0.5">{circuitName} • Track Position</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">LIVE</span>
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Track Progress Bar */}
        <div className="relative mb-6">
          {/* Sector labels */}
          <div className="flex justify-between mb-2 px-1">
            <span className="text-[10px] text-white/30 font-mono">S/F</span>
            <span className="text-[10px] text-yellow-500/60 font-mono">S1</span>
            <span className="text-[10px] text-yellow-500/60 font-mono">S2</span>
            <span className="text-[10px] text-yellow-500/60 font-mono">S3</span>
            <span className="text-[10px] text-white/30 font-mono">S/F</span>
          </div>

          {/* Main track bar */}
          <div className="relative h-16 bg-[#1a1a1f] rounded-lg overflow-hidden border border-white/5">
            {/* Sector dividers */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1" />
            </div>
            
            {/* Sector backgrounds */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-gradient-to-r from-purple-500/5 to-purple-500/10" />
              <div className="flex-1 bg-gradient-to-r from-blue-500/5 to-blue-500/10" />
              <div className="flex-1 bg-gradient-to-r from-green-500/5 to-green-500/10" />
            </div>

            {/* DRS Zone indicator */}
            <div 
              className="absolute top-0 bottom-0 bg-emerald-500/10 border-l border-r border-emerald-500/30"
              style={{ left: '60%', width: '15%' }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-emerald-400 font-bold">
                DRS
              </span>
            </div>

            {/* Start/Finish checkered */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-white/20 via-black/20 to-white/20" 
                 style={{ backgroundSize: '100% 8px' }} />
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-white/20 via-black/20 to-white/20"
                 style={{ backgroundSize: '100% 8px' }} />

            {/* Driver dots on track */}
            {displayDrivers.map((driver) => {
              const progress = driverProgress[driver.id] || 0;
              const isSelected = selectedDriver === driver.id;
              
              return (
                <div
                  key={driver.id}
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 cursor-pointer group"
                  style={{ 
                    left: `${progress * 100}%`,
                    zIndex: isSelected ? 50 : 10 - driver.position
                  }}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                >
                  {/* Glow effect */}
                  {isSelected && (
                    <div 
                      className="absolute -inset-4 rounded-full blur-md"
                      style={{ backgroundColor: driver.color, opacity: 0.3 }}
                    />
                  )}
                  
                  {/* Driver dot */}
                  <div 
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all",
                      isSelected ? "w-8 h-8 -ml-4" : "w-6 h-6 -ml-3"
                    )}
                    style={{ backgroundColor: driver.color }}
                  >
                    <span className="text-[9px] font-bold text-white">
                      {driver.position}
                    </span>
                    
                    {/* Highlight */}
                    <div className="absolute top-0.5 left-1 w-2 h-1 bg-white/40 rounded-full" />
                  </div>
                  
                  {/* Driver code tooltip */}
                  <div className={cn(
                    "absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap transition-opacity",
                    isSelected || "opacity-0 group-hover:opacity-100"
                  )}
                    style={{ backgroundColor: driver.color }}
                  >
                    {driver.code}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Track length indicator */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-white/20">0%</span>
            <span className="text-[10px] text-white/20">Lap Progress</span>
            <span className="text-[10px] text-white/20">100%</span>
          </div>
        </div>

        {/* Sector Times Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((sector) => (
            <div key={sector} className="bg-[#12121a] rounded-lg p-3 border border-white/5">
              <div className="text-[10px] text-white/40 mb-1">Sector {sector}</div>
              <div className="flex flex-wrap gap-1">
                {displayDrivers
                  .filter(d => (currentSector[d.id] || 1) === sector)
                  .map(driver => (
                    <div 
                      key={driver.id}
                      className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: driver.color }}
                    >
                      {driver.position}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>

        {/* Driver Position List */}
        <div className="bg-[#12121a] rounded-lg border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-3 py-2 text-[10px] text-white/40 border-b border-white/5">
            <span>POS</span>
            <span>DRIVER</span>
            <span>GAP</span>
            <span>SECTOR</span>
          </div>
          
          <div className="divide-y divide-white/5">
            {displayDrivers.map((driver) => {
              const isSelected = selectedDriver === driver.id;
              const sector = currentSector[driver.id] || 1;
              
              return (
                <div 
                  key={driver.id}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-3 py-2 items-center cursor-pointer transition-colors",
                    isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"
                  )}
                >
                  {/* Position */}
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: driver.color }}
                  >
                    {driver.position}
                  </div>
                  
                  {/* Driver info */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{driver.code}</span>
                    <span className="text-white/40 text-xs">{driver.team}</span>
                  </div>
                  
                  {/* Gap */}
                  <div className="text-right">
                    <span className={cn(
                      "font-mono text-xs",
                      driver.position === 1 ? "text-white" : "text-white/60"
                    )}>
                      {driver.position === 1 ? 'LEADER' : `+${((driver.position - 1) * 1.2).toFixed(1)}s`}
                    </span>
                  </div>
                  
                  {/* Current sector */}
                  <div className="w-8 text-center">
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      sector === 1 ? "text-purple-400" : sector === 2 ? "text-blue-400" : "text-green-400"
                    )}>
                      S{sector}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Driver Telemetry */}
        {selectedDriverData && (
          <div className="mt-4 bg-black/50 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: selectedDriverData.color }}
                >
                  P{selectedDriverData.position}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{selectedDriverData.code}</div>
                  <div className="text-sm text-white/50">{selectedDriverData.team}</div>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-cyan-400">{selectedDriverData.speed}</div>
                  <div className="text-[10px] text-white/40 uppercase">km/h</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-purple-400">
                    {formatLapTime(selectedDriverData.lapTime)}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase">best lap</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-emerald-400">
                    S{currentSector[selectedDriverData.id] || 1}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase">sector</div>
                </div>
              </div>
            </div>
          </div>
        )}
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
