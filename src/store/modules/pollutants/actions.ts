import { Actions } from 'vuex-smart-module';
import { API } from '@/services/api';
import { PollutantsMutations } from './mutations';
import { PollutantsState } from './state';
import { Pollutants } from './types';

export class PollutantsActions extends Actions<
PollutantsState,
never,
PollutantsMutations,
PollutantsActions
> {
  async fetchPollutants(): Promise<Pollutants> {
    const response = await API.pollutants.get();
    this.mutations.setPollutants(response.data);
    return response.data;
  }
}
