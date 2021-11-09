import { Module } from 'vuex-smart-module';
import { AuthActions } from '@/store/modules/auth/actions';
import { AuthMutations } from '@/store/modules/auth/mutations';
import { AuthState } from '@/store/modules/auth/state';
import { AuthGetters } from '@/store/modules/auth/getters';

export default new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions,
});
