/**
 * Utilitaires pour les remorques (trailers)
 */

import type { ApiTrailer } from "@/types";
import { calculateBatteryLevel } from "./battery";

// TODO Position de l'entrepôt à Nantes à changer avec les données de la page params
export const WAREHOUSE_POSITION = {
  lat: 47.2184,
  lng: -1.5536,
};

/**
 * Génère le numéro de série formaté
 */
export function formatSerialNumber(id: number): string {
  return `QU-${id.toString().padStart(3, '0')}-IS`;
}

/**
 * Formate une distance en km avec séparateur français
 */
export function formatDistance(km: number): string {
  return `${km.toLocaleString('fr-FR')} km`;
}

/**
 * Calcule la distance entre deux points GPS en km (formule de Haversine)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Vérifie si le véhicule est à l'entrepôt (dans un rayon de 0.1km)
 */
export function isAtWarehouse(trailer: ApiTrailer): boolean {
  const distance = calculateDistance(
    parseFloat(trailer.actual_pos_lat),
    parseFloat(trailer.actual_pos_long),
    WAREHOUSE_POSITION.lat,
    WAREHOUSE_POSITION.lng
  );
  return distance < 0.1;
}

/**
 * Détermine le statut d'un trailer selon sa position et son état
 */
export function determineStatus(trailer: ApiTrailer): string {
  const atWarehouse = isAtWarehouse(trailer);
  const batteryLevel = calculateBatteryLevel(trailer);

  // 1. Maintenance : disponibilité technique < 50%
  if (trailer.technical_disponibility < 50) {
    return "Maintenance";
  }

  // 2. En charge : à l'entrepôt ET batterie < 75%
  if (atWarehouse && batteryLevel < 75) {
    return "Charging";
  }

  // 3. Disponible : 0km daily ET >50km autonomie ET à l'entrepôt
  if (trailer.daily_km_traveled === 0 && trailer.autonomy > 50 && atWarehouse) {
    return "Available";
  }

  // 4. En service : autonomie <50km ET daily_km >0 ET pas à l'entrepôt
  if (trailer.autonomy < 50 && trailer.daily_km_traveled > 0 && !atWarehouse) {
    return "On Mission";
  }

  // Par défaut : En service si daily_km > 0, sinon Disponible
  return trailer.daily_km_traveled > 0 ? "On Mission" : "Available";
}
