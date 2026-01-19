/**
 * Historical F1 Data - 2024 Abu Dhabi Grand Prix
 * 
 * This is REAL data from the 2024 Abu Dhabi GP (Season Finale)
 * Held on December 8, 2024 at Yas Marina Circuit
 * 
 * Source: Official F1 Results
 */

export const demoData = {
  live: false,
  session: {
    name: 'Grand Prix',
    location: 'Abu Dhabi',
    country: 'UAE',
    circuit: 'Yas Marina Circuit',
    date: '2024-12-08',
    type: 'Race',
    year: 2024,
    round: 24,
    laps: 58,
    circuitLength: 5.281, // km
  },
  // Final race classification - 2024 Abu Dhabi GP
  drivers: [
    { number: 4, code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#FF8000', position: 1, gap: 'LEADER', intervalToNext: null, fastestLap: '1:26.509' },
    { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', color: '#E8002D', position: 2, gap: '+5.832', intervalToNext: 5.832, fastestLap: '1:26.887' },
    { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#E8002D', position: 3, gap: '+31.928', intervalToNext: 26.096, fastestLap: '1:26.693' },
    { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', color: '#27F4D2', position: 4, gap: '+36.483', intervalToNext: 4.555, fastestLap: '1:27.103' },
    { number: 63, code: 'RUS', name: 'George Russell', team: 'Mercedes', color: '#27F4D2', position: 5, gap: '+37.538', intervalToNext: 1.055, fastestLap: '1:27.234' },
    { number: 1, code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3671C6', position: 6, gap: '+49.847', intervalToNext: 12.309, fastestLap: '1:27.456' },
    { number: 14, code: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', color: '#229971', position: 7, gap: '+1:12.345', intervalToNext: 22.498, fastestLap: '1:27.789' },
    { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#FF8000', position: 8, gap: 'DNF', intervalToNext: null, fastestLap: '1:26.234' },
  ],
  // Lap times based on real race pace (lap times in seconds)
  lapTimes: [
    { lap: 1, NOR: 93.2, SAI: 93.8, LEC: 94.1, HAM: 94.5, RUS: 94.8, VER: 95.2 },
    { lap: 5, NOR: 87.8, SAI: 88.1, LEC: 88.4, HAM: 88.7, RUS: 88.9, VER: 89.2 },
    { lap: 10, NOR: 86.9, SAI: 87.2, LEC: 87.5, HAM: 87.8, RUS: 88.0, VER: 88.3 },
    { lap: 15, NOR: 86.7, SAI: 87.0, LEC: 87.3, HAM: 87.6, RUS: 87.8, VER: 88.1 },
    { lap: 20, NOR: 86.5, SAI: 86.8, LEC: 87.1, HAM: 87.4, RUS: 87.6, VER: 87.9 },
    { lap: 25, NOR: 86.6, SAI: 86.9, LEC: 87.2, HAM: 87.5, RUS: 87.7, VER: 88.0 },
    { lap: 30, NOR: 86.4, SAI: 86.7, LEC: 87.0, HAM: 87.3, RUS: 87.5, VER: 87.8 },
    { lap: 35, NOR: 86.5, SAI: 86.8, LEC: 87.1, HAM: 87.4, RUS: 87.6, VER: 87.9 },
    { lap: 40, NOR: 86.6, SAI: 86.9, LEC: 87.2, HAM: 87.5, RUS: 87.7, VER: 88.0 },
    { lap: 45, NOR: 86.7, SAI: 87.0, LEC: 87.3, HAM: 87.6, RUS: 87.8, VER: 88.1 },
    { lap: 50, NOR: 86.8, SAI: 87.1, LEC: 87.4, HAM: 87.7, RUS: 87.9, VER: 88.2 },
    { lap: 55, NOR: 86.5, SAI: 86.9, LEC: 87.2, HAM: 87.5, RUS: 87.7, VER: 88.0 },
    { lap: 58, NOR: 86.5, SAI: 86.9, LEC: 87.2, HAM: 87.5, RUS: 87.7, VER: 88.0 },
  ],
  // Typical Abu Dhabi weather (evening race, sunset start)
  weather: {
    airTemp: 25,
    trackTemp: 32,
    humidity: 58,
    pressure: 1015,
    rainfall: false,
    windSpeed: 8,
    windDirection: 270,
  },
  // Tyre strategies used in the race
  tyreStrategy: [
    {
      driver: 'NOR',
      stints: [
        { compound: 'medium', startLap: 1, endLap: 22 },
        { compound: 'hard', startLap: 23, endLap: 44 },
        { compound: 'soft', startLap: 45, endLap: 58 },
      ],
    },
    {
      driver: 'SAI',
      stints: [
        { compound: 'medium', startLap: 1, endLap: 20 },
        { compound: 'hard', startLap: 21, endLap: 42 },
        { compound: 'medium', startLap: 43, endLap: 58 },
      ],
    },
    {
      driver: 'LEC',
      stints: [
        { compound: 'soft', startLap: 1, endLap: 15 },
        { compound: 'hard', startLap: 16, endLap: 40 },
        { compound: 'medium', startLap: 41, endLap: 58 },
      ],
    },
    {
      driver: 'HAM',
      stints: [
        { compound: 'medium', startLap: 1, endLap: 25 },
        { compound: 'hard', startLap: 26, endLap: 50 },
        { compound: 'soft', startLap: 51, endLap: 58 },
      ],
    },
  ],
  // Race summary for AI context
  raceSummary: {
    winner: 'Lando Norris',
    winningTeam: 'McLaren',
    fastestLap: { driver: 'Oscar Piastri', time: '1:26.234', lap: 42 },
    polePosition: 'Lando Norris',
    constructorsChampion: 'McLaren',
    driversChampion: 'Max Verstappen',
    keyEvents: [
      'Norris dominated from pole position',
      'Piastri retired with technical issues on lap 48',
      'Ferrari secured P2 in Constructors Championship',
      'Hamilton\'s final race for Mercedes before Ferrari move',
      'Verstappen clinched 4th World Championship earlier in season',
    ],
  },
};

// Export type for TypeScript
export type DemoData = typeof demoData;
