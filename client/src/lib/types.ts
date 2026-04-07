export type SensorType = 'sound' | 'smoke' | 'motion';
export type AlertPriority = 'critical' | 'warning' | 'normal';
export type SensorStatus = 'active' | 'inactive' | 'alert';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  battery: number;
  lastUpdate: Date;
  signalStrength: number;
}

export interface Incident {
  id: string;
  sensorId: string;
  sensorType: SensorType;
  priority: AlertPriority;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  timestamp: Date;
  resolved: boolean;
}

export interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][];
  color: string;
}

export interface DashboardStats {
  totalAlerts24h: number;
  activeIncidents: number;
  sensorsOnline: number;
  sensorsTotal: number;
  alertsTrend: { hour: string; count: number }[];
}

export const SENSOR_TYPE_LABELS: Record<SensorType, string> = {
  sound: 'Détection Sonore',
  smoke: 'Détection Fumée',
  motion: 'Détection Mouvement',
};

export const SENSOR_TYPE_ICONS: Record<SensorType, string> = {
  sound: 'Volume2',
  smoke: 'Flame',
  motion: 'Video',
};

export const PRIORITY_LABELS: Record<AlertPriority, string> = {
  critical: 'Critique',
  warning: 'Avertissement',
  normal: 'Normal',
};

export const STATUS_LABELS: Record<SensorStatus, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  alert: 'Alerte',
};
