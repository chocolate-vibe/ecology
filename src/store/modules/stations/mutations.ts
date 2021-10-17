import { Mutations } from 'vuex-smart-module';
import { Marker } from 'mapbox-gl';
import { Stations } from './types';
import { StationsState } from './state';

export class StationsMutations extends Mutations<StationsState> {
  setStations(payload: Stations): void {
    this.state.stations = payload;
  }
  addStationsMapMarker(payload: Marker) {
    this.state.stationMapMarkers = [...this.state.stationMapMarkers, payload];
  }
}
