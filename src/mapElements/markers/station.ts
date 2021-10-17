import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { Station } from '@/store/modules/stations/types';
import { store } from '@/store';

export const createStationMarker = (map: Map | undefined, station: Station): Marker | null => {
  if (!map) return null;

  const element = document.createElement('div');
  element.classList.add('mdi', 'mdi-album', 'map-marker', 'map-marker__station');

  const marker = new mapboxgl.Marker({
    element,
  }).setLngLat([station.lng, station.lat]);

  const markerEl = marker.getElement();

  const markerTooltip = document.createElement('div');
  markerTooltip.classList.add('map-marker__station-tooltip');
  markerTooltip.innerHTML = station.title;
  markerEl.appendChild(markerTooltip);

  markerEl.addEventListener('click', () => {
    console.log('click: ', station);
  });

  marker.addTo(map);
  store.stations.mutations.addStationsMapMarker(marker);

  return marker;
};
