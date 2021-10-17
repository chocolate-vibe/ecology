import { Module } from 'vuex-smart-module';
import { PollutantsState } from './state';
import { PollutantsMutations } from './mutations';
import { PollutantsActions } from './actions';

export default new Module({
  state: PollutantsState,
  mutations: PollutantsMutations,
  actions: PollutantsActions,
});
