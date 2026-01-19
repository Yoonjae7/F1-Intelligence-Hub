/**
 * F1 Data Service
 * 
 * Fetches live F1 data from OpenF1 API (completely free!)
 * https://openf1.org/
 * 
 * This service is designed to work without any API keys or costs.
 * Data updates automatically during live F1 sessions.
 */

const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

// Cache duration in milliseconds
const CACHE_DURATION = 5000; // 5 seconds for live data

interface CachedData<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CachedData<any>>();

/**
 * Generic fetch with caching
 */
async function fetchWithCache<T>(endpoint: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(`${OPENF1_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

/**
 * Get latest session info
 */
export async function getLatestSession() {
  try {
    const sessions = await fetchWithCache<any[]>(
      '/sessions?session_name=Race&year=2024',
      'latest_session'
    );
    
    // Get the most recent race
    return sessions[sessions.length - 1];
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

/**
 * Get current driver positions
 */
export async function getDriverPositions(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const positions = await fetchWithCache<any[]>(
      `/position?session_key=${session}`,
      `positions_${session}`
    );
    
    // Get latest position for each driver
    const latestPositions = new Map();
    positions.forEach(pos => {
      const existing = latestPositions.get(pos.driver_number);
      if (!existing || new Date(pos.date) > new Date(existing.date)) {
        latestPositions.set(pos.driver_number, pos);
      }
    });
    
    return Array.from(latestPositions.values());
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
}

/**
 * Get lap times for drivers
 */
export async function getLapTimes(sessionKey?: number, driverNumbers?: number[]) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    let endpoint = `/laps?session_key=${session}`;
    if (driverNumbers && driverNumbers.length > 0) {
      endpoint += `&driver_number=${driverNumbers.join(',')}`;
    }
    
    const laps = await fetchWithCache<any[]>(
      endpoint,
      `laps_${session}_${driverNumbers?.join(',') || 'all'}`
    );
    
    return laps;
  } catch (error) {
    console.error('Error fetching lap times:', error);
    return [];
  }
}

/**
 * Get driver list with info
 */
export async function getDrivers(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const drivers = await fetchWithCache<any[]>(
      `/drivers?session_key=${session}`,
      `drivers_${session}`
    );
    
    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

/**
 * Get pit stops
 */
export async function getPitStops(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const pits = await fetchWithCache<any[]>(
      `/pit?session_key=${session}`,
      `pits_${session}`
    );
    
    return pits;
  } catch (error) {
    console.error('Error fetching pit stops:', error);
    return [];
  }
}

/**
 * Get car data (telemetry)
 */
export async function getCarData(sessionKey?: number, driverNumber?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    let endpoint = `/car_data?session_key=${session}`;
    if (driverNumber) {
      endpoint += `&driver_number=${driverNumber}`;
    }
    
    const carData = await fetchWithCache<any[]>(
      endpoint,
      `car_data_${session}_${driverNumber || 'all'}`
    );
    
    return carData;
  } catch (error) {
    console.error('Error fetching car data:', error);
    return [];
  }
}

/**
 * Get weather data
 */
export async function getWeather(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const weather = await fetchWithCache<any[]>(
      `/weather?session_key=${session}`,
      `weather_${session}`
    );
    
    return weather[weather.length - 1]; // Return latest weather
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

/**
 * Get race control messages
 */
export async function getRaceControl(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const messages = await fetchWithCache<any[]>(
      `/race_control?session_key=${session}`,
      `race_control_${session}`
    );
    
    return messages;
  } catch (error) {
    console.error('Error fetching race control:', error);
    return [];
  }
}

/**
 * Get intervals (gaps between drivers)
 */
export async function getIntervals(sessionKey?: number) {
  try {
    const session = sessionKey || (await getLatestSession())?.session_key;
    if (!session) return [];
    
    const intervals = await fetchWithCache<any[]>(
      `/intervals?session_key=${session}`,
      `intervals_${session}`
    );
    
    // Get latest interval for each driver
    const latestIntervals = new Map();
    intervals.forEach(interval => {
      const existing = latestIntervals.get(interval.driver_number);
      if (!existing || new Date(interval.date) > new Date(existing.date)) {
        latestIntervals.set(interval.driver_number, interval);
      }
    });
    
    return Array.from(latestIntervals.values());
  } catch (error) {
    console.error('Error fetching intervals:', error);
    return [];
  }
}

/**
 * Check if there's a live session
 */
export async function isLiveSession() {
  try {
    const session = await getLatestSession();
    if (!session) return false;
    
    const sessionDate = new Date(session.date_start);
    const sessionEnd = new Date(session.date_end);
    const now = new Date();
    
    return now >= sessionDate && now <= sessionEnd;
  } catch (error) {
    return false;
  }
}

/**
 * Clear cache (useful for forcing refresh)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Helper: Convert lap time in seconds to formatted string (MM:SS.mmm)
 */
export function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}

/**
 * Helper: Get driver abbreviation color by team
 */
export function getDriverColor(teamName: string): string {
  const colors: Record<string, string> = {
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
  
  return colors[teamName] || '#FFFFFF';
}
