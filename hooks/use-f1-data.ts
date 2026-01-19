import { useState, useEffect, useCallback } from 'react';

export interface F1SessionData {
  live: boolean;
  session: {
    name: string;
    location: string;
    country: string;
    circuit: string;
    date: string;
    type: string;
  };
  drivers: Array<{
    number: number;
    code: string;
    name: string;
    team: string;
    color: string;
    position: number;
    gap: string;
    intervalToNext: number | null;
  }>;
  lapTimes: Array<{
    lap: number;
    [driverCode: string]: number;
  }>;
  weather: {
    airTemp: number;
    trackTemp: number;
    humidity: number;
    pressure: number;
    rainfall: boolean;
    windSpeed: number;
    windDirection: number;
  } | null;
}

interface UseF1DataOptions {
  refreshInterval?: number; // milliseconds, default 10000 (10 seconds)
  enabled?: boolean;
}

export function useF1Data(options: UseF1DataOptions = {}) {
  const { refreshInterval = 10000, enabled = true } = options;
  
  const [data, setData] = useState<F1SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch('/api/f1-data?type=all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch F1 data');
      }

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching F1 data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();

    // Set up auto-refresh
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isLive: data?.live || false,
  };
}

/**
 * Hook for specific data types (positions, laps, intervals)
 */
export function useF1DataType(type: 'positions' | 'laps' | 'intervals', options: UseF1DataOptions = {}) {
  const { refreshInterval = 10000, enabled = true } = options;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch(`/api/f1-data?type=${type}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [type, enabled]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
