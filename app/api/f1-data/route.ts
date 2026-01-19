import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestSession,
  getDriverPositions,
  getLapTimes,
  getDrivers,
  getIntervals,
  getWeather,
  isLiveSession,
  getDriverColor,
} from '@/lib/f1-data-service';

export const dynamic = 'force-dynamic';
export const revalidate = 5; // Revalidate every 5 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Check if there's a live session
    const live = await isLiveSession();
    const session = await getLatestSession();

    if (!session) {
      return NextResponse.json({
        error: 'No session data available',
        live: false,
      }, { status: 404 });
    }

    // Fetch data based on type
    if (type === 'all') {
      const [drivers, positions, laps, intervals, weather] = await Promise.all([
        getDrivers(session.session_key),
        getDriverPositions(session.session_key),
        getLapTimes(session.session_key),
        getIntervals(session.session_key),
        getWeather(session.session_key),
      ]);

      // Process data for frontend
      const processedData = {
        live,
        session: {
          name: session.session_name,
          location: session.location,
          country: session.country_name,
          circuit: session.circuit_short_name,
          date: session.date_start,
          type: session.session_type,
        },
        drivers: processDriverData(drivers, positions, intervals),
        lapTimes: processLapTimes(laps, drivers),
        weather: weather ? {
          airTemp: weather.air_temperature,
          trackTemp: weather.track_temperature,
          humidity: weather.humidity,
          pressure: weather.pressure,
          rainfall: weather.rainfall,
          windSpeed: weather.wind_speed,
          windDirection: weather.wind_direction,
        } : null,
      };

      return NextResponse.json(processedData);
    }

    // Handle specific data types
    switch (type) {
      case 'positions':
        const positions = await getDriverPositions(session.session_key);
        return NextResponse.json({ live, positions });
      
      case 'laps':
        const laps = await getLapTimes(session.session_key);
        return NextResponse.json({ live, laps });
      
      case 'intervals':
        const intervals = await getIntervals(session.session_key);
        return NextResponse.json({ live, intervals });
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

  } catch (error) {
    console.error('F1 data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch F1 data', live: false },
      { status: 500 }
    );
  }
}

/**
 * Process driver data for frontend
 */
function processDriverData(drivers: any[], positions: any[], intervals: any[]) {
  return drivers.map(driver => {
    const position = positions.find(p => p.driver_number === driver.driver_number);
    const interval = intervals.find(i => i.driver_number === driver.driver_number);
    
    return {
      number: driver.driver_number,
      code: driver.name_acronym,
      name: driver.full_name,
      team: driver.team_name,
      color: getDriverColor(driver.team_name),
      position: position?.position || 0,
      gap: interval?.gap_to_leader || (position?.position === 1 ? 'LEADER' : 'N/A'),
      intervalToNext: interval?.interval || null,
    };
  }).sort((a, b) => a.position - b.position);
}

/**
 * Process lap times for charts
 */
function processLapTimes(laps: any[], drivers: any[]) {
  // Group laps by driver
  const lapsByDriver = new Map<number, any[]>();
  
  laps.forEach(lap => {
    if (!lapsByDriver.has(lap.driver_number)) {
      lapsByDriver.set(lap.driver_number, []);
    }
    lapsByDriver.get(lap.driver_number)!.push(lap);
  });

  // Process each driver's laps
  const processedLaps: any[] = [];
  const maxLaps = Math.max(...Array.from(lapsByDriver.values()).map(l => l.length), 0);

  for (let lapNum = 1; lapNum <= maxLaps; lapNum++) {
    const lapData: any = { lap: lapNum };
    
    lapsByDriver.forEach((driverLaps, driverNumber) => {
      const lap = driverLaps.find(l => l.lap_number === lapNum);
      const driver = drivers.find(d => d.driver_number === driverNumber);
      
      if (lap && driver && lap.lap_duration) {
        // Convert to seconds
        lapData[driver.name_acronym] = lap.lap_duration;
      }
    });
    
    processedLaps.push(lapData);
  }

  return processedLaps;
}
