import { Actions } from 'vuex-smart-module';
import { API } from '@/services/api';
import { StationsMutations } from './mutations';
import { StationsState } from './state';
import { Stations } from './types';

export class StationsActions extends Actions<
StationsState,
never,
StationsMutations,
StationsActions
> {
  async fetchStations(): Promise<Stations> {
    const response = await API.stations.get();
    this.mutations.setStations(response.data);
    return response.data;
  }
}
