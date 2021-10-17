import { Marker } from 'mapbox-gl';
import { Stations } from './types';

export class StationsState {
  stations: Stations = [];
  stationMapMarkers: Marker[] = [];
}
