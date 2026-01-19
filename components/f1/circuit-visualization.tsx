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
  trackProgress: number;
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

  const circuitName = session?.circuit || session?.location || "Circuit";
  const raceName = session?.name || "Grand Prix";
  const location = session?.location || "Race Track";

  useEffect(() => {
    const initial: { [key: string]: number } = {};
    const sectors: { [key: string]: number } = {};
    displayDrivers.forEach((driver, idx) => {
      initial[driver.id] = (0.95 - idx * 0.05 + 1) % 1;
      sectors[driver.id] = Math.floor(initial[driver.id] * 3) + 1;
    });
    setDriverProgress(initial);
    setCurrentSector(sectors);
  }, [displayDrivers.length]);

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

  return (
    <Card
      className={cn(
        "transition-all duration-500 bg-[#0a0a0c]",
        highlighted && "ring-2 ring-primary shadow-lg shadow-primary/20"
      )}
    >
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 border-b border-white/5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-white truncate">
              {location} {raceName}
            </CardTitle>
            <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 truncate">{circuitName} • Track Position</p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">LIVE</span>
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4">
        {/* Track Progress Bar */}
        <div className="relative mb-4 sm:mb-6">
          {/* Sector labels - hidden on very small screens */}
          <div className="hidden xs:flex justify-between mb-2 px-1">
            <span className="text-[8px] sm:text-[10px] text-white/30 font-mono">S/F</span>
            <span className="text-[8px] sm:text-[10px] text-yellow-500/60 font-mono">S1</span>
            <span className="text-[8px] sm:text-[10px] text-yellow-500/60 font-mono">S2</span>
            <span className="text-[8px] sm:text-[10px] text-yellow-500/60 font-mono">S3</span>
            <span className="text-[8px] sm:text-[10px] text-white/30 font-mono">S/F</span>
          </div>

          {/* Main track bar */}
          <div className="relative h-12 sm:h-16 bg-[#1a1a1f] rounded-lg overflow-hidden border border-white/5">
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

            {/* DRS Zone */}
            <div 
              className="absolute top-0 bottom-0 bg-emerald-500/10 border-l border-r border-emerald-500/30"
              style={{ left: '60%', width: '15%' }}
            >
              <span className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 text-[6px] sm:text-[8px] text-emerald-400 font-bold">
                DRS
              </span>
            </div>

            {/* Start/Finish checkered */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-white/20 via-black/20 to-white/20" 
                 style={{ backgroundSize: '100% 8px' }} />
            <div className="absolute right-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-white/20 via-black/20 to-white/20"
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
                  {isSelected && (
                    <div 
                      className="absolute -inset-3 sm:-inset-4 rounded-full blur-md"
                      style={{ backgroundColor: driver.color, opacity: 0.3 }}
                    />
                  )}
                  
                  <div 
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all",
                      isSelected ? "w-6 h-6 sm:w-8 sm:h-8 -ml-3 sm:-ml-4" : "w-5 h-5 sm:w-6 sm:h-6 -ml-2.5 sm:-ml-3"
                    )}
                    style={{ backgroundColor: driver.color }}
                  >
                    <span className="text-[8px] sm:text-[9px] font-bold text-white">
                      {driver.position}
                    </span>
                    <div className="absolute top-0.5 left-0.5 sm:left-1 w-1.5 sm:w-2 h-0.5 sm:h-1 bg-white/40 rounded-full" />
                  </div>
                  
                  {/* Driver code - only visible on hover/select on desktop */}
                  <div className={cn(
                    "absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[9px] font-mono font-bold whitespace-nowrap transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                  )}
                    style={{ backgroundColor: driver.color }}
                  >
                    {driver.code}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Simple progress indicator */}
          <div className="flex sm:hidden justify-between mt-1.5 px-1">
            <span className="text-[8px] text-white/20">Start</span>
            <span className="text-[8px] text-white/20">Lap Progress</span>
            <span className="text-[8px] text-white/20">Finish</span>
          </div>

          {/* Desktop: Full progress indicator */}
          <div className="hidden sm:flex justify-between mt-2 px-1">
            <span className="text-[10px] text-white/20">0%</span>
            <span className="text-[10px] text-white/20">Lap Progress</span>
            <span className="text-[10px] text-white/20">100%</span>
          </div>
        </div>

        {/* Sector Times Grid - Responsive */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {[1, 2, 3].map((sector) => (
            <div key={sector} className="bg-[#12121a] rounded-lg p-2 sm:p-3 border border-white/5">
              <div className="text-[8px] sm:text-[10px] text-white/40 mb-1">S{sector}</div>
              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                {displayDrivers
                  .filter(d => (currentSector[d.id] || 1) === sector)
                  .map(driver => (
                    <div 
                      key={driver.id}
                      onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white cursor-pointer hover:scale-110 transition-transform"
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

        {/* Driver Position List - Scrollable on mobile */}
        <div className="bg-[#12121a] rounded-lg border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 sm:gap-x-3 px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] text-white/40 border-b border-white/5">
            <span>POS</span>
            <span>DRIVER</span>
            <span className="text-right">GAP</span>
            <span className="text-center">SEC</span>
          </div>
          
          <div className="divide-y divide-white/5 max-h-[200px] sm:max-h-none overflow-y-auto">
            {displayDrivers.map((driver) => {
              const isSelected = selectedDriver === driver.id;
              const sector = currentSector[driver.id] || 1;
              
              return (
                <div 
                  key={driver.id}
                  onClick={() => setSelectedDriver(isSelected ? null : driver.id)}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto] gap-x-2 sm:gap-x-3 px-2 sm:px-3 py-1.5 sm:py-2 items-center cursor-pointer transition-colors active:bg-white/10",
                    isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"
                  )}
                >
                  <div 
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold text-white"
                    style={{ backgroundColor: driver.color }}
                  >
                    {driver.position}
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{driver.code}</span>
                    <span className="text-white/40 text-[10px] sm:text-xs truncate hidden xs:inline">{driver.team}</span>
                  </div>
                  
                  <div className="text-right">
                    <span className={cn(
                      "font-mono text-[10px] sm:text-xs",
                      driver.position === 1 ? "text-white" : "text-white/60"
                    )}>
                      {driver.position === 1 ? 'LDR' : `+${((driver.position - 1) * 1.2).toFixed(1)}`}
                    </span>
                  </div>
                  
                  <div className="w-6 sm:w-8 text-center">
                    <span className={cn(
                      "text-[10px] sm:text-xs font-mono font-bold",
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

        {/* Selected Driver Telemetry - Compact on mobile */}
        {selectedDriverData && (
          <div className="mt-3 sm:mt-4 bg-black/50 border border-white/10 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div 
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center text-base sm:text-lg font-bold text-white"
                  style={{ backgroundColor: selectedDriverData.color }}
                >
                  P{selectedDriverData.position}
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">{selectedDriverData.code}</div>
                  <div className="text-xs sm:text-sm text-white/50 truncate max-w-[80px] sm:max-w-none">{selectedDriverData.team}</div>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-mono font-bold text-cyan-400">{selectedDriverData.speed}</div>
                  <div className="text-[8px] sm:text-[10px] text-white/40 uppercase">km/h</div>
                </div>
                <div className="text-center hidden xs:block">
                  <div className="text-lg sm:text-2xl font-mono font-bold text-purple-400">
                    {formatLapTime(selectedDriverData.lapTime)}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-white/40 uppercase">best</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-mono font-bold text-emerald-400">
                    S{currentSector[selectedDriverData.id] || 1}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-white/40 uppercase">sec</div>
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
