// client/src/components/MapView.tsx
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  Flame,
  Video,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import { mockZones, mockIncidents, mockSensors } from "@/lib/mockData";
import type { Incident, Sensor, SensorType, AlertPriority } from "@/lib/types";
import { SENSOR_TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

// Centre Abidjan
const CENTER_LAT = 5.3600;
const CENTER_LNG = -4.0083;
const DEFAULT_ZOOM = 15;

/* ---------- ICONES ---------- */
const createMarkerIcon = (priority: AlertPriority, isActive: boolean) => {
  const color =
    priority === "critical" ? "#DC2626" :
    priority === "warning"  ? "#F59E0B" : "#10B981";
  const pulseClass = isActive ? "animate-pulse" : "";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative ${pulseClass}">
        <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2v10"></path>
            <path d="M18.4 6.6a9 9 0 1 1-12.77.04"></path>
          </svg>
        </div>
        ${isActive ? `
          <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${color}"></div>
        ` : ""}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createSensorIcon = (type: SensorType, status: string) => {
  const isAlert = status === "alert";
  const color =
    isAlert ? "#DC2626" : status === "active" ? "#10B981" : "#9CA3AF";

  const iconSvg =
    type === "sound"
      ? "<path d='M11 5 6 9H2v6h4l5 4V5ZM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07'/>"
      : type === "smoke"
      ? "<path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z'/>"
      : "<path d='m22 8-6 4 6 4V8ZM14 4v16H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10Z'/>";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center" style="background-color: ${color}">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          ${iconSvg}
        </svg>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

/* ---------- SOUS-COMPOSANTS ---------- */
function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function IncidentMarker({ incident }: { incident: Incident }) {
  const isActive = !incident.resolved;
  const icon = createMarkerIcon(incident.priority, isActive);

  return (
    <Marker
      position={[incident.location.lat, incident.location.lng]}
      icon={icon}
    >
      <Popup>
        <div className="min-w-[200px] p-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              className={`w-4 h-4 ${
                incident.priority === "critical"
                  ? "text-[#DC2626]"
                  : incident.priority === "warning"
                  ? "text-[#F59E0B]"
                  : "text-[#10B981]"
              }`}
            />
            <span className="font-semibold text-sm">{incident.title}</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{incident.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {formatRelativeTime(incident.timestamp)}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-white text-xs ${
                incident.priority === "critical"
                  ? "bg-[#DC2626]"
                  : incident.priority === "warning"
                  ? "bg-[#F59E0B]"
                  : "bg-[#10B981]"
              }`}
            >
              {PRIORITY_LABELS[incident.priority]}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function SensorMarker({ sensor }: { sensor: Sensor }) {
  const icon = createSensorIcon(sensor.type, sensor.status);

  return (
    <Marker
      position={[sensor.location.lat, sensor.location.lng]}
      icon={icon}
    >
      <Popup>
        <div className="min-w-[180px] p-1">
          <div className="font-semibold text-sm mb-1">{sensor.name}</div>
          <div className="text-xs text-gray-600 mb-2">
            {SENSOR_TYPE_LABELS[sensor.type]}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                sensor.status === "active"
                  ? "bg-[#10B981]"
                  : sensor.status === "alert"
                  ? "bg-[#DC2626]"
                  : "bg-gray-400"
              }`}
            />
            <span className="capitalize">{sensor.status}</span>
            <span className="text-gray-400">|</span>
            <span>Batterie: {sensor.battery}%</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

/* ---------- ROUTING ---------- */
function RoutingControl({
  userLatLng,
  sensorLatLng,
}: {
  userLatLng: [number, number];
  sensorLatLng: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLatLng || !sensorLatLng) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLatLng[0], userLatLng[1]),
        L.latLng(sensorLatLng[0], sensorLatLng[1]),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      // @ts-ignore – non documenté dans les types
      createMarkers: () => null,
      lineOptions: {
        styles: [{ color: "#3B82F6", weight: 4, opacity: 0.7 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
        language: "fr",
      }),
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, userLatLng, sensorLatLng]);

  return null;
}

/* ---------- COMPOSANT PRINCIPAL ---------- */
export function MapView() {
  /* états */
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  /* géolocalisation */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Géolocalisation refusée", err),
      { enableHighAccuracy: true }
    );
  }, []);

  /* données */
  const activeIncidents = mockIncidents.filter((i) => !i.resolved);

  /* helper interne : recenter sur la position */
  function Recenter() {
    const map = useMap();
    useEffect(() => {
      if (userPos) map.setView(userPos, 11);
    }, [userPos, map]);
    return null;
  }

  /* JSX */
  return (
    <Card className="overflow-hidden" data-testid="map-view">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#3B82F6]" />
          Carte des Zones Surveillées
        </CardTitle>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span>Critique</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span>Avertissement</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span>Normal</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[500px] w-full relative">
          <MapContainer
            center={[CENTER_LAT, CENTER_LNG]}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full z-0"
            scrollWheelZoom={true}
          >
            <MapUpdater />
            <Recenter />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Zones */}
            {mockZones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coordinates.map(([lng, lat]) => [lat, lng])}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="font-semibold">{zone.name}</div>
                </Popup>
              </Polygon>
            ))}

            {/* Position utilisateur */}
            {userPos && (
              <Marker
                position={userPos}
                icon={L.divIcon({
                  className: "user-pos",
                  html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })}
              >
                <Popup>Ma position</Popup>
              </Marker>
            )}

            {/* Capteurs cliquables */}
            {mockSensors.map((sensor) => (
              <Marker
                key={sensor.id}
                position={[sensor.location.lat, sensor.location.lng]}
                icon={createSensorIcon(sensor.type, sensor.status)}
                eventHandlers={{
                  click: () => setSelectedSensor(sensor),
                }}
              >
                <Popup>
                  <div className="min-w-[180px] p-1">
                    <div className="font-semibold text-sm mb-1">{sensor.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{SENSOR_TYPE_LABELS[sensor.type]}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${sensor.status === "active" ? "bg-[#10B981]" : sensor.status === "alert" ? "bg-[#DC2626]" : "bg-gray-400"}`} />
                      <span className="capitalize">{sensor.status}</span>
                      <span className="text-gray-400">|</span>
                      <span>Batterie: {sensor.battery}%</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Incidents */}
            {activeIncidents.map((incident) => (
              <IncidentMarker key={incident.id} incident={incident} />
            ))}

            {/* Itinéraire */}
            {userPos && selectedSensor && (
              <RoutingControl
                userLatLng={userPos}
                sensorLatLng={[
                  selectedSensor.location.lat,
                  selectedSensor.location.lng,
                ]}
              />
            )}
          </MapContainer>

          {/* Badge incidents actifs */}
          {activeIncidents.length > 0 && (
            <div className="absolute top-4 right-4 z-[1000]">
              <Badge className="bg-[#DC2626] text-white flex items-center gap-1.5 py-1.5 px-3 shadow-lg">
                <AlertTriangle className="w-4 h-4" />
                {activeIncidents.length} incident
                {activeIncidents.length > 1 ? "s" : ""} actif
                {activeIncidents.length > 1 ? "s" : ""}
              </Badge>
            </div>
          )}

          {/* Bouton annuler trajet */}
          {selectedSensor && (
            <button
              className="absolute top-14 right-4 z-[1000] bg-white/90 hover:bg-white text-xs px-3 py-1.5 rounded shadow"
              onClick={() => setSelectedSensor(null)}
            >
              Annuler l’itinéraire
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}