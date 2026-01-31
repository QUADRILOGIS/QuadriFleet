interface Alert {
  id: number;
  status: string;
  piece_id: number;
  trailer_id: number;
  alert_date: string;
  resolution_comment: string | null;
  resolution_date: string | null;
  resolution_cost: number | null;
  piece_name: string;
}

interface Incident {
  id: number;
  message: string;
  trailer_id: number;
  created_at: string;
  seriousness: string;
}

const ALERT_STATUS_PRIORITY: { [key: string]: number } = {
  critic: 0,
  warning: 1,
  solved: 2,
};

/**
 * Trie les alertes par ordre de priorité de statut, puis par date décroissante
 */
export const sortAlerts = (alerts: Alert[]): Alert[] => {
  return [...alerts].sort((a, b) => {
    // 1. Comparer par priorité de statut
    const priorityA = ALERT_STATUS_PRIORITY[a.status] ?? 999;
    const priorityB = ALERT_STATUS_PRIORITY[b.status] ?? 999;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 2. Si même priorité, trier par date décroissante (plus récent en premier)
    const dateA = new Date(a.alert_date).getTime();
    const dateB = new Date(b.alert_date).getTime();

    return dateB - dateA;
  });
};

/**
 * Trie les incidents par ordre de gravité décroissante, puis par date décroissante
 */
export const sortIncidents = (incidents: Incident[]): Incident[] => {
  return [...incidents].sort((a, b) => {
    // 1. Comparer par gravité (10 = plus critique, 1 = moins critique)
    const seriousnessA = parseInt(a.seriousness);
    const seriousnessB = parseInt(b.seriousness);

    if (seriousnessA !== seriousnessB) {
      return seriousnessB - seriousnessA; 
    }

    // 2. Si même gravité, trier par date décroissante (plus récent en premier)
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return dateB - dateA;
  });
};
