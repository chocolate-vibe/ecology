import { Module } from 'vuex-smart-module';
import { MainState } from './state';
import { MainMutations } from './mutations';
import { MainActions } from './actions';
import { MainGetters } from './getters';

export default new Module({
  state: MainState,
  getters: MainGetters,
  mutations: MainMutations,
  actions: MainActions,
});
