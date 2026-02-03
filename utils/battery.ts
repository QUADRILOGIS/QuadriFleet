
/**
 * Retourne la classe CSS pour la couleur du texte de batterie
 */
export function getBatteryTextColor(percent: number): string {
  if (percent <= 20) return "text-red-600";
  if (percent <= 50) return "text-orange-500";
  return "text-green-600";
}

/**
 * Retourne la classe CSS pour la couleur de l'icône de batterie
 */
export function getBatteryIconColor(percent: number): string {
  if (percent <= 20) return "text-red-500";
  if (percent <= 50) return "text-orange-500";
  return "text-green-500";
}

/**
 * Retourne la couleur hex pour les icônes Lucide (même seuils que le texte)
 */
export function getBatteryHexColor(percent: number): string {
  if (percent <= 20) return "#dc2626"; // red-600
  if (percent <= 50) return "#f97316"; // orange-500
  return "#16a34a"; // green-600
}


