import { Module } from 'vuex-smart-module';
import { MetricState } from './state';
import { MetricMutations } from './mutations';
import { MetricActions } from './actions';

export default new Module({
  state: MetricState,
  mutations: MetricMutations,
  actions: MetricActions,
});
