import { useQuery } from '@tanstack/react-query';
import type { Incident } from '@/lib/types';

// Mapper les données backend → format Incident du frontend
function mapAlerteToIncident(alerte: any): Incident {
  const isCritical = alerte.flamme === 'OUI' || alerte.fumee > 150;
  const isWarning = alerte.fumee > 100;

  return {
    id: String(alerte.id),
    sensorId: String(alerte.device_id),
    title: alerte.flamme === 'OUI' 
      ? '🔥 Détection de flamme' 
      : `Fumée détectée (${alerte.fumee} ppm)`,
    sensorType: alerte.flamme === 'OUI' ? 'smoke' : 'sound',
    priority: isCritical ? 'critical' : isWarning ? 'warning' : 'normal',
    description: `Device ${alerte.device_id} — Flamme: ${alerte.flamme} | Fumée: ${alerte.fumee} ppm | Status: ${alerte.status}`,
    location: {
      zone: alerte.device_id ?? 'Zone inconnue',
      lat: alerte.lat ?? 0,
      lng: alerte.lng ?? 0,
    },
    timestamp: new Date(alerte.created_at),
    resolved: alerte.status === 'OK',
  };
}

export function useAlertes() {
  return useQuery({
    queryKey: ['alertes'],
    queryFn: async () => {
     const res = await fetch('https://backend-forestguard-production.up.railway.app/api/alertes');
      if (!res.ok) throw new Error('Erreur chargement alertes');
      const data = await res.json();
      return data.map(mapAlerteToIncident) as Incident[];
    },
    refetchInterval: 5000, // rafraîchit toutes les 5 secondes
  });
}