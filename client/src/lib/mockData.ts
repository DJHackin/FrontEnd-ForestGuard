import type { Sensor, Incident, Zone, DashboardStats, SensorType } from './types';

const now = new Date();

function hoursAgo(hours: number): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

function minutesAgo(minutes: number): Date {
  return new Date(now.getTime() - minutes * 60 * 1000);
}

export const mockZones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Cocody',
    coordinates: [
      [-3.99, 5.33], 
      [-3.96, 5.33], 
      [-3.96, 5.38], 
      [-3.99, 5.38], 
      [-3.99, 5.33],
    ],
    color: '#3B82F6',
  },
  {
    id: 'zone-2',
    name: 'Plateau',
    coordinates: [
      [-4.04, 5.30], 
      [-4.02, 5.30], 
      [-4.02, 5.325], 
      [-4.04, 5.325], 
      [-4.04, 5.30],
    ],
    color: '#10B981',
  },
  {
    id: 'zone-3',
    name: 'Koumassi',
    coordinates: [
      [-3.985, 5.27], 
      [-3.965, 5.27], 
      [-3.965, 5.29], 
      [-3.985, 5.29], 
      [-3.985, 5.27],
    ],
    color: '#F59E0B',
  },
  {
    id: 'zone-3',
    name: 'Abobo',
    coordinates: [
      [-4.05, 5.405], 
      [-4.015, 5.405], 
      [-4.015, 5.425], 
      [-4.05, 5.425], 
      [-4.05, 5.405],
    ],
    color: '#F59E0B',
  },
  {
    id: 'zone-3',
    name: 'Yopougon',
    coordinates: [
      [-4.08, 5.23], 
      [-4.05, 5.23], 
      [-4.05, 5.265], 
      [-4.08, 5.265], 
      [-4.08, 5.23],
    ],
    color: '#F59E0B',
  },
];

export const mockSensors: Sensor[] = [
  {
    id: 'sensor-001',
    name: 'Capteur Sonore Alpha-1',
    type: 'sound',
    status: 'alert',
    location: { lat: 5.3550, lng: -3.9750, zone: 'Cocody' },
    battery: 87,
    lastUpdate: minutesAgo(2),
    signalStrength: 95,
  },
  {
    id: 'sensor-002',
    name: 'Capteur Sonore Alpha-2',
    type: 'sound',
    status: 'active',
    location: { lat: 5.3200, lng: -4.0300, zone: 'Plateau' },
    battery: 92,
    lastUpdate: minutesAgo(5),
    signalStrength: 88,
  },
  {
    id: 'sensor-003',
    name: 'Détecteur Fumée Beta-1',
    type: 'smoke',
    status: 'alert',
    location: { lat: 5.2750, lng: -3.9700, zone: 'Koumassi' },
    battery: 78,
    lastUpdate: minutesAgo(1),
    signalStrength: 92,
  },
  {
    id: 'sensor-004',
    name: 'Détecteur Fumée Beta-2',
    type: 'smoke',
    status: 'active',
    location: { lat: 5.4100, lng: -4.0400, zone: 'Abobo' },
    battery: 65,
    lastUpdate: minutesAgo(8),
    signalStrength: 75,
  },
  {
    id: 'sensor-005',
    name: 'Caméra Motion Gamma-1',
    type: 'motion',
    status: 'active',
    location: { lat: 5.2500, lng: -4.0550, zone: 'Yopougon' },
    battery: 94,
    lastUpdate: minutesAgo(3),
    signalStrength: 98,
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    sensorId: 'sensor-001',
    sensorType: 'sound',
    priority: 'critical',
    title: 'Détection de coup de feu',
    description: 'Signature acoustique correspondant à une arme à feu détectée dans la zone Forêt Nord. Niveau sonore: 142 dB.',
    location: { lat: 5.2400, lng: -4.0700, zone: 'Yopougon' },
    timestamp: minutesAgo(2),
    resolved: false,
  },
  {
    id: 'inc-002',
    sensorId: 'sensor-003',
    sensorType: 'smoke',
    priority: 'critical',
    title: 'Fumée détectée - Risque incendie',
    description: 'Concentration de fumée élevée détectée. Particules: 450 ppm. Intervention recommandée.',
    location: { lat: 5.4150, lng: -4.0200, zone: 'Abobo' },
    timestamp: minutesAgo(1),
    resolved: false,
  },
];

export const mockStats: DashboardStats = {
  totalAlerts24h: 23,
  activeIncidents: 3,
  sensorsOnline: 7,
  sensorsTotal: 8,
  alertsTrend: [
    { hour: '00h', count: 1 },
    { hour: '02h', count: 0 },
    { hour: '04h', count: 2 },
    { hour: '06h', count: 1 },
    { hour: '08h', count: 3 },
    { hour: '10h', count: 2 },
    { hour: '12h', count: 4 },
    { hour: '14h', count: 2 },
    { hour: '16h', count: 3 },
    { hour: '18h', count: 2 },
    { hour: '20h', count: 1 },
    { hour: '22h', count: 2 },
  ],
};

export function getSensorsByType(type: SensorType): Sensor[] {
  return mockSensors.filter(s => s.type === type);
}

export function getIncidentsByType(type: SensorType | 'all'): Incident[] {
  if (type === 'all') return mockIncidents;
  return mockIncidents.filter(i => i.sensorType === type);
}

export function getActiveIncidents(): Incident[] {
  return mockIncidents.filter(i => !i.resolved);
}

export function getSensorById(id: string): Sensor | undefined {
  return mockSensors.find(s => s.id === id);
}
