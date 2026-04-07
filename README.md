# Tableau de Bord IoT - Surveillance en Temps Réel

Application web de surveillance IoT affichant des alertes en temps réel depuis plusieurs types de capteurs avec visualisation géographique des zones surveillées.

## Fonctionnalités

- **Tableau de bord principal** avec statistiques en temps réel
- **Carte interactive OpenStreetMap** avec zones surveillées et incidents
- **Alertes multi-capteurs** : détection sonore, fumée, mouvement
- **Timeline des incidents** avec filtrage par type
- **État des capteurs** avec indicateurs visuels (batterie, signal, statut)
- **Interface entièrement en français**

## Technologies Frontend

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Leaflet (OpenStreetMap)
- Recharts (graphiques)
- date-fns (dates en français)
- Wouter (routing)
- TanStack Query (gestion d'état)

## Démarrage

```bash
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5000`

---

## Guide d'Intégration Backend

Ce frontend utilise actuellement des données mockées. Voici les spécifications pour l'intégration avec un backend réel.

### Structure des Données

#### Sensor (Capteur)

```typescript
interface Sensor {
  id: string;                    // Identifiant unique (ex: "sensor-001")
  name: string;                  // Nom du capteur (ex: "Capteur Sonore Alpha-1")
  type: SensorType;              // "sound" | "smoke" | "motion"
  status: SensorStatus;          // "active" | "inactive" | "alert"
  location: {
    lat: number;                 // Latitude GPS
    lng: number;                 // Longitude GPS
    zone: string;                // Nom de la zone (ex: "Forêt Nord")
  };
  battery: number;               // Pourcentage batterie (0-100)
  lastUpdate: Date;              // Dernière mise à jour ISO 8601
  signalStrength: number;        // Force du signal (0-100)
}
```

#### Incident (Alerte)

```typescript
interface Incident {
  id: string;                    // Identifiant unique
  sensorId: string;              // ID du capteur source
  sensorType: SensorType;        // Type du capteur
  priority: AlertPriority;       // "critical" | "warning" | "normal"
  title: string;                 // Titre de l'alerte (ex: "Détection de coup de feu")
  description: string;           // Description détaillée
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  timestamp: Date;               // Date/heure de l'incident ISO 8601
  resolved: boolean;             // Incident résolu ou non
}
```

#### Zone (Zone Surveillée)

```typescript
interface Zone {
  id: string;                    // Identifiant unique
  name: string;                  // Nom de la zone
  coordinates: [number, number][]; // Polygone [lng, lat][]
  color: string;                 // Couleur hex (ex: "#3B82F6")
}
```

#### DashboardStats (Statistiques)

```typescript
interface DashboardStats {
  totalAlerts24h: number;        // Nombre d'alertes sur 24h
  activeIncidents: number;       // Incidents non résolus
  sensorsOnline: number;         // Capteurs en ligne
  sensorsTotal: number;          // Total de capteurs
  alertsTrend: {                 // Tendance des alertes par heure
    hour: string;                // Format "00h", "02h", etc.
    count: number;
  }[];
}
```

### Endpoints API Recommandés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/sensors` | Liste tous les capteurs |
| GET | `/api/sensors/:id` | Détails d'un capteur |
| GET | `/api/incidents` | Liste des incidents (support filtrage) |
| GET | `/api/incidents/active` | Incidents actifs uniquement |
| GET | `/api/incidents/:id` | Détails d'un incident |
| PATCH | `/api/incidents/:id/resolve` | Marquer un incident comme résolu |
| GET | `/api/zones` | Liste des zones surveillées |
| GET | `/api/stats` | Statistiques du tableau de bord |

### Paramètres de Filtrage (GET /api/incidents)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `type` | string | Filtrer par type: "sound", "smoke", "motion" |
| `priority` | string | Filtrer par priorité: "critical", "warning", "normal" |
| `resolved` | boolean | Filtrer par statut de résolution |
| `from` | ISO 8601 | Date de début |
| `to` | ISO 8601 | Date de fin |
| `limit` | number | Nombre max de résultats |
| `offset` | number | Pagination offset |

### Exemple de Réponse API

```json
// GET /api/incidents/active
{
  "data": [
    {
      "id": "inc-001",
      "sensorId": "sensor-001",
      "sensorType": "sound",
      "priority": "critical",
      "title": "Détection de coup de feu",
      "description": "Signature acoustique correspondant à une arme à feu détectée...",
      "location": {
        "lat": 48.73,
        "lng": 5.92,
        "zone": "Forêt Nord"
      },
      "timestamp": "2024-12-14T09:15:00.000Z",
      "resolved": false
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10
  }
}
```

### Intégration WebSocket (Temps Réel)

Pour les mises à jour en temps réel, implémenter un serveur WebSocket :

```typescript
// Événements WebSocket
interface WSEvents {
  "incident:new": Incident;       // Nouvel incident
  "incident:resolved": string;    // ID incident résolu
  "sensor:status": {              // Changement statut capteur
    id: string;
    status: SensorStatus;
  };
  "sensor:alert": Sensor;         // Capteur en alerte
}

// Connexion côté client
const ws = new WebSocket("wss://api.example.com/ws");
ws.onmessage = (event) => {
  const { type, payload } = JSON.parse(event.data);
  // Mettre à jour l'état selon le type d'événement
};
```

### Variables d'Environnement

```env
VITE_API_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com/ws
VITE_MAP_CENTER_LAT=48.715
VITE_MAP_CENTER_LNG=5.94
VITE_MAP_ZOOM=12
```

### Modification du Frontend pour Backend Réel

Remplacer les imports de `mockData.ts` par des appels API avec TanStack Query :

```typescript
// Exemple pour les incidents
import { useQuery } from "@tanstack/react-query";

function useIncidents(filter?: SensorType) {
  return useQuery({
    queryKey: ['/api/incidents', filter],
    // queryFn est configuré par défaut
  });
}

// Usage dans un composant
function IncidentTimeline() {
  const { data, isLoading, error } = useIncidents();
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  
  return <Timeline incidents={data} />;
}
```

### Types de Capteurs

| Type | Code | Description | Événements Détectés |
|------|------|-------------|---------------------|
| Son | `sound` | Détection acoustique | Coups de feu, tronçonneuses, explosions |
| Fumée | `smoke` | Détection de particules | Incendies, fumée, feux de camp |
| Mouvement | `motion` | Caméra avec IA | Présence humaine, véhicules, animaux |

### Priorités d'Alerte

| Priorité | Code | Couleur | Exemples |
|----------|------|---------|----------|
| Critique | `critical` | #DC2626 | Coups de feu, incendie actif |
| Avertissement | `warning` | #F59E0B | Tronçonneuse, fumée légère, intrusion |
| Normal | `normal` | #10B981 | Animal détecté, activité normale |

---

## Structure du Projet

```
client/
├── src/
│   ├── components/
│   │   ├── ui/           # Composants shadcn/ui
│   │   ├── Header.tsx    # En-tête avec statistiques rapides
│   │   ├── StatsCards.tsx # Cartes de statistiques
│   │   ├── MapView.tsx   # Carte interactive Leaflet
│   │   ├── AlertCard.tsx # Carte d'alerte individuelle
│   │   ├── ActiveAlerts.tsx # Liste des alertes actives
│   │   ├── SensorFilters.tsx # Filtres par type de capteur
│   │   ├── SensorStatusGrid.tsx # Grille d'état des capteurs
│   │   └── IncidentTimeline.tsx # Timeline des incidents
│   ├── lib/
│   │   ├── types.ts      # Types TypeScript
│   │   ├── mockData.ts   # Données mockées (à remplacer)
│   │   ├── utils.ts      # Utilitaires et formatage dates
│   │   └── queryClient.ts # Configuration TanStack Query
│   ├── pages/
│   │   └── Dashboard.tsx # Page principale
│   └── App.tsx           # Point d'entrée React
└── index.html
```

## Licence

Hanniel - Tous droits réservés