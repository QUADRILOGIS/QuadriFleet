export interface ApiTrailer {
  id: number;
  manager_id: number;
  daily_km_traveled: number;
  downtime: number;
  actual_pos_long: string;
  actual_pos_lat: string;
  total_delivery_count: number;
  technical_disponibility: number;
  average_downtime: number;
  total_energy_consumption: number;
  daily_energy_consumption: number;
  energy_consumption_per_100_km: number;
  yearly_maintenance_cost: number;
  purchased_date: string;
  autonomy: number;
  total_km_traveled: number;
  active_alerts_count?: string;
  battery_level?: number;
  serial_number?: string;
}

export interface Alert {
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

export interface Performance {
  date: string;
  distance: string;
  energy: string;
  deliveries: string;
}

export interface Incident {
  id: number;
  message: string;
  trailer_id: number;
  created_at: string;
  seriousness: string;
}

export interface TrailerDetails {
  trailer: ApiTrailer;
  alerts: Alert[];
  performance: Performance[];
  recent_incidents: Incident[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
