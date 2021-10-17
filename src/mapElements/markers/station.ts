import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { Station } from '@/store/modules/stations/types';
import { store } from '@/store';

export const createStationMarker = (map: Map | undefined, station: Station): Marker | null => {
  if (!map) return null;

  const element = document.createElement('div');
  element.classList.add('map-marker', 'map-marker__station');

  const marker = new mapboxgl.Marker({
    element,
  }).setLngLat([station.lng, station.lat]);

  const markerEl = marker.getElement();

  const markerTooltip = document.createElement('div');
  markerTooltip.classList.add('map-marker__station-tooltip');
  markerTooltip.innerHTML = station.title;
  markerEl.appendChild(markerTooltip);

  const markerConcentration = document.createElement('div');
  markerConcentration.classList.add('map-marker__station-concentration');
  markerEl.appendChild(markerConcentration);

  markerEl.addEventListener('click', () => {
    console.log('click: ', station);
  });

  marker.addTo(map);
  store.stations.mutations.addStationsMapMarker(marker);

  return marker;
};
