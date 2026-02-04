import { useState, useEffect, useCallback } from 'react';
import { getTrailers, getTrailerById, getTrailerAlertsAndIncidents } from './trailers';
import type { ApiTrailer, TrailerDetails, Alert, Incident } from '@/types';


interface UseTrailersReturn {
  trailers: ApiTrailer[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer la liste des trailers
 */
export function useTrailers(): UseTrailersReturn {
  const [trailers, setTrailers] = useState<ApiTrailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrailers();
      setTrailers(data);
    } catch (err) {
      console.error('Error fetching trailers:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setTrailers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrailers();
  }, []);

  return {
    trailers,
    loading,
    error,
    refetch: fetchTrailers,
  };
}

interface UseTrailerDetailsReturn {
  data: TrailerDetails | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les détails d'un trailer
 */
export function useTrailerDetails(trailerId: string | number): UseTrailerDetailsReturn {
  const [data, setData] = useState<TrailerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await getTrailerById(trailerId);
      setData(details);
    } catch (err) {
      console.error('Error fetching trailer details:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [trailerId]);

  useEffect(() => {
    if (trailerId) {
      fetchDetails();
    }
  }, [trailerId, fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetails,
  };
}

interface UseTrailerAlertsCountReturn {
  alertCount: number;
  incidentCount: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer uniquement le nombre d'alertes et incidents d'un trailer
 */
export function useTrailerAlertsCount(trailerId: number | string): UseTrailerAlertsCountReturn {
  const [alertCount, setAlertCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { alerts, incidents } = await getTrailerAlertsAndIncidents(trailerId);
        setAlertCount(alerts?.length || 0);
        setIncidentCount(incidents?.length || 0);
      } catch (err) {
        console.error('Error fetching alerts count:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (trailerId) {
      fetchCounts();
    }
  }, [trailerId]);

  return {
    alertCount,
    incidentCount,
    loading,
    error,
  };
}

interface UseAlertsReturn {
  alerts: Alert[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer toutes les alertes de tous les trailers
 */
export function useAlerts(onlyActive = false): UseAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { trailers } = useTrailers();

  useEffect(() => {
    const fetchAllAlerts = async () => {
      if (trailers.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        const allAlerts: Alert[] = [];
        
        for (const trailer of trailers) {
          try {
            const { alerts } = await getTrailerAlertsAndIncidents(trailer.id);
            if (alerts) {
              allAlerts.push(...alerts);
            }
          } catch {
            // Continue with other trailers
          }
        }
        
        const nextAlerts = onlyActive
          ? allAlerts.filter((alert) => alert.status !== "solved")
          : allAlerts;
        setAlerts(nextAlerts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllAlerts();
  }, [trailers, onlyActive]);

  const refetch = async () => {
    if (trailers.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const allAlerts: Alert[] = [];

      for (const trailer of trailers) {
        try {
          const { alerts } = await getTrailerAlertsAndIncidents(trailer.id);
          if (alerts) {
            allAlerts.push(...alerts);
          }
        } catch {
          // Continue with other trailers
        }
      }

      const nextAlerts = onlyActive
        ? allAlerts.filter((alert) => alert.status !== "solved")
        : allAlerts;
      setAlerts(nextAlerts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return { alerts, loading, error, refetch };
}

interface UseIncidentsReturn {
  incidents: Incident[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer tous les incidents de tous les trailers
 */
export function useIncidents(): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { trailers } = useTrailers();

  useEffect(() => {
    const fetchAllIncidents = async () => {
      if (trailers.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        const allIncidents: Incident[] = [];
        
        for (const trailer of trailers) {
          try {
            const { incidents } = await getTrailerAlertsAndIncidents(trailer.id);
            if (incidents) {
              allIncidents.push(...incidents);
            }
          } catch {
            // Continue with other trailers
          }
        }
        
        setIncidents(allIncidents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllIncidents();
  }, [trailers]);

  return { incidents, loading, error };
}
