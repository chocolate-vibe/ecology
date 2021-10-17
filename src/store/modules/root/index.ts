import { Module } from 'vuex-smart-module';
import { RootActions } from './actions';
import { RootMutations } from './mutations';
import { RootState } from './state';

export default new Module({
  state: RootState,
  mutations: RootMutations,
  actions: RootActions,
});
