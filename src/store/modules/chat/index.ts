import { Module } from 'vuex-smart-module';
import { ChatState } from './state';
import { ChatMutations } from './mutations';
import { ChatActions } from './actions';

export default new Module({
  state: ChatState,
  mutations: ChatMutations,
  actions: ChatActions,
});
