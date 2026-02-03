// Types pour les statuts des trailers
export type TrailerStatus = "Available" | "On Mission" | "Charging" | "Maintenance";
export type AlertStatus = "critic" | "warning" | "solved";
export type TagSeverity = "success" | "info" | "warning" | "danger";

/**
 * Configuration des couleurs par statut
 */
export const STATUS_COLORS: Record<TrailerStatus, string> = {
  "Available": "#22c55e",
  "On Mission": "#ebb813",
  "Charging": "#3b82f6",
  "Maintenance": "#ef4444",
};

/**
 * Retourne le style inline pour un tag de statut
 */
export function getStatusStyle(status: string): React.CSSProperties {
  const color = STATUS_COLORS[status as TrailerStatus];
  if (!color) return {};
  return { backgroundColor: color, color: "white" };
}

/**
 * Retourne la sévérité PrimeReact pour un statut de trailer
 */
export function getStatusSeverity(status: string): TagSeverity | undefined {
  switch (status) {
    case "Available": return "success";
    case "On Mission": return "warning";
    case "Charging": return "info";
    case "Maintenance": return "danger";
    default: return undefined;
  }
}

/**
 * Retourne la sévérité PrimeReact pour un statut d'alerte
 */
export function getAlertSeverity(status: string): TagSeverity {
  switch (status) {
    case "critic": return "danger";
    case "warning": return "warning";
    default: return "info";
  }
}

/**
 * Retourne les classes CSS pour la couleur de sériousness d'un incident
 */
export function getSeriousnessColor(seriousness: string): string {
  const level = parseInt(seriousness);
  if (level >= 7) return "bg-red-50 border-gray-200";
  if (level >= 4) return "bg-orange-50 border-gray-200";
  return "bg-yellow-50 border-gray-200";
}

/**
 * Retourne la sévérité PrimeReact pour la sériousness d'un incident
 */
export function getSeriousnessSeverity(seriousness: string): TagSeverity {
  const level = parseInt(seriousness);
  if (level >= 7) return "danger";
  if (level >= 4) return "warning";
  return "info";
}
