import { Mutations } from 'vuex-smart-module';
import { Pollutants } from './types';
import { PollutantsState } from './state';

export class PollutantsMutations extends Mutations<PollutantsState> {
  setPollutants(payload: Pollutants) {
    this.state.pollutants = payload;
  }
}
