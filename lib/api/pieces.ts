import { apiClient } from './client';

export interface Piece {
  id: number;
  name: string;
  trigger_limit: number;
  warning_percent: number;
}

interface PiecesResponse {
  success: boolean;
  data: Piece[];
  count: number;
}

interface PieceUpdateData {
  name: string;
  trigger_limit: number;
  warning_percent: number;
}

/**
 * Récupère toutes les pièces depuis l'API
 */
export async function fetchPieces(): Promise<Piece[]> {
  const response = await apiClient.get<PiecesResponse>("/api/pieces");
  if (response.success) {
    return response.data;
  }
  throw new Error("Failed to fetch pieces");
}

/**
 * Met à jour une pièce via l'API
 */
export async function updatePiece(id: number, data: PieceUpdateData): Promise<void> {
  await apiClient.put(`/api/pieces/${id}`, data);
}
