/**
 * Formate une date en format français (JJ/MM/AAAA)
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formate une date et heure en format français
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calcule l'âge en années à partir d'une date
 * Utilise une année de référence fixe pour être déterministe (évite Date.now())
 */
export function calculateAge(dateString: string, referenceYear: number = 2026): number {
  const year = new Date(dateString).getFullYear();
  return referenceYear - year;
}
