import type { ApiTrailer } from "@/types";

/**
 * Calcule le niveau de batterie restant en pourcentage
 */
export function calculateBatteryLevel(trailer: ApiTrailer): number {
  const dailyConsumption = (trailer.daily_km_traveled / 100) * trailer.energy_consumption_per_100_km;
  const batteryCapacity = (trailer.autonomy / 100) * trailer.energy_consumption_per_100_km;
  return Math.max(0, Math.min(100, 100 * (1 - dailyConsumption / batteryCapacity)));
}

/**
 * Retourne la classe CSS pour la couleur du texte de batterie
 */
export function getBatteryTextColor(percent: number): string {
  if (percent <= 15) return "text-red-600";
  if (percent <= 35) return "text-orange-500";
  return "text-green-600";
}

/**
 * Retourne la classe CSS pour la couleur de l'icône de batterie
 */
export function getBatteryIconColor(percent: number): string {
  if (percent <= 15) return "text-red-500";
  if (percent <= 35) return "text-orange-500";
  return "text-green-500";
}


