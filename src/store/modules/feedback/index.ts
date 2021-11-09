import { Module } from 'vuex-smart-module';
import { FeedbackState } from './state';
import { FeedbackMutations } from './mutations';
import { FeedbackActions } from './actions';

export default new Module({
  state: FeedbackState,
  mutations: FeedbackMutations,
  actions: FeedbackActions,
});
