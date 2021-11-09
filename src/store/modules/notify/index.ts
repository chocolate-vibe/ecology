import { Module } from 'vuex-smart-module';
import { NotifyState } from './state';
import { NotifyMutations } from './mutations';

export default new Module({
  state: NotifyState,
  mutations: NotifyMutations,
});
