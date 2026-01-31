import { apiClient } from './client';
import type { ApiTrailer, TrailerDetails, ApiResponse } from '@/types';

/**
 * Récupère la liste de tous les trailers
 */
export async function getTrailers(): Promise<ApiTrailer[]> {
  const response = await apiClient.get<ApiResponse<ApiTrailer[]>>('/api/trailers');
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch trailers');
  }
  
  return response.data;
}

/**
 * Récupère les détails d'un trailer spécifique
 */
export async function getTrailerById(id: number | string): Promise<TrailerDetails> {
  const response = await apiClient.get<ApiResponse<TrailerDetails>>(`/api/trailers/${id}`);
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch trailer details');
  }
  
  return response.data;
}

/**
 * Récupère uniquement les alertes et incidents d'un trailer
*/
export async function getTrailerAlertsAndIncidents(id: number | string): Promise<{
  alerts: TrailerDetails['alerts'];
  incidents: TrailerDetails['recent_incidents'];
}> {
  const details = await getTrailerById(id);
  
  return {
    alerts: details.alerts,
    incidents: details.recent_incidents,
  };
}
