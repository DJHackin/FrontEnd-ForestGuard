// client/src/components/RoutingControl.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

interface Props {
  /** [lat, lng] de l'utilisateur */
  userLatLng: [number, number];
  /** [lat, lng] du capteur sélectionné */
  sensorLatLng: [number, number];
}

export default function RoutingControl({ userLatLng, sensorLatLng }: Props) {
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
      // @ts-ignore – createMarkers n’est pas déclaré dans les types mais existe
      createMarkers: () => null,
    lineOptions: {
        styles: [{ color: '#3B82F6', weight: 4, opacity: 1 }],
        extendToWaypoints: false,      
        missingRouteTolerance: 0,      
    },
      // service OSRM public (Paé c'est gratuit tchai)
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot', // ou 'driving', 'bike'
      }),
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, userLatLng, sensorLatLng]);

  return null;
}