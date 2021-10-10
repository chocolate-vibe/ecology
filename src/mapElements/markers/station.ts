import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { Station } from '../../types/stations';

export const createStationMarker = (map: Map, station: Station): Marker => {
  const marker = new mapboxgl.Marker({
    element: document.createElement('div'),
  }).setLngLat([station.lng, station.lat]);

  const markerEl = marker.getElement();

  const markerTooltip = document.createElement('div');
  markerTooltip.classList.add('map-marker__tooltip');
  markerTooltip.innerHTML = station.title;
  markerEl.appendChild(markerTooltip);

  markerEl.classList.add('map-marker');
  markerEl.addEventListener('click', () => {
    console.log(markerEl);
    console.log(`click: ${station.title}`);
  });

  marker.addTo(map);

  return marker;
};
