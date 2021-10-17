import { Module } from 'vuex-smart-module';
import { StationsActions } from './actions';
import { StationsMutations } from './mutations';
import { StationsState } from './state';

export default new Module({
  state: StationsState,
  mutations: StationsMutations,
  actions: StationsActions,
});
