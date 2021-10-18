import { Module } from 'vuex-smart-module';
import { AuthActions } from '@/store/modules/auth/actions';
import { AuthMutations } from '@/store/modules/auth/mutations';
import { AuthState } from '@/store/modules/auth/state';

export default new Module({
  state: AuthState,
  mutations: AuthMutations,
  actions: AuthActions,
});
