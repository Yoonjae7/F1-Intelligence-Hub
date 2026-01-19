/**
 * Demo F1 Data
 * 
 * Used when there's no live F1 session.
 * This ensures the dashboard always looks great with realistic data.
 */

export const demoData = {
  live: false,
  session: {
    name: 'Race',
    location: 'Monaco',
    country: 'Monaco',
    circuit: 'Monaco',
    date: new Date().toISOString(),
    type: 'Race',
  },
  drivers: [
    { number: 1, code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3671C6', position: 1, gap: 'LEADER', intervalToNext: null },
    { number: 44, code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', color: '#27F4D2', position: 2, gap: '+2.345', intervalToNext: 2.345 },
    { number: 16, code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#E8002D', position: 3, gap: '+5.678', intervalToNext: 3.333 },
    { number: 4, code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#FF8000', position: 4, gap: '+8.901', intervalToNext: 3.223 },
    { number: 55, code: 'SAI', name: 'Carlos Sainz', team: 'Ferrari', color: '#E8002D', position: 5, gap: '+12.345', intervalToNext: 3.444 },
    { number: 81, code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#FF8000', position: 6, gap: '+15.678', intervalToNext: 3.333 },
    { number: 63, code: 'RUS', name: 'George Russell', team: 'Mercedes', color: '#27F4D2', position: 7, gap: '+18.901', intervalToNext: 3.223 },
    { number: 11, code: 'PER', name: 'Sergio Perez', team: 'Red Bull Racing', color: '#3671C6', position: 8, gap: '+22.345', intervalToNext: 3.444 },
  ],
  lapTimes: [
    { lap: 1, VER: 78.2, HAM: 78.5, LEC: 78.8, NOR: 79.1 },
    { lap: 2, VER: 77.8, HAM: 77.9, LEC: 78.1, NOR: 78.3 },
    { lap: 3, VER: 77.5, HAM: 77.7, LEC: 77.9, NOR: 78.0 },
    { lap: 4, VER: 77.3, HAM: 77.5, LEC: 77.8, NOR: 77.9 },
    { lap: 5, VER: 77.2, HAM: 77.4, LEC: 77.6, NOR: 77.8 },
    { lap: 6, VER: 77.1, HAM: 77.3, LEC: 77.5, NOR: 77.7 },
    { lap: 7, VER: 77.0, HAM: 77.2, LEC: 77.4, NOR: 77.6 },
    { lap: 8, VER: 76.9, HAM: 77.1, LEC: 77.3, NOR: 77.5 },
    { lap: 9, VER: 76.8, HAM: 77.0, LEC: 77.2, NOR: 77.4 },
    { lap: 10, VER: 76.7, HAM: 76.9, LEC: 77.1, NOR: 77.3 },
    { lap: 11, VER: 76.6, HAM: 76.8, LEC: 77.0, NOR: 77.2 },
    { lap: 12, VER: 76.5, HAM: 76.7, LEC: 76.9, NOR: 77.1 },
  ],
  weather: {
    airTemp: 28,
    trackTemp: 48,
    humidity: 45,
    pressure: 1013,
    rainfall: false,
    windSpeed: 12,
    windDirection: 315,
  },
};
