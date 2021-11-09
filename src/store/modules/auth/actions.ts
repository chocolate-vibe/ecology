import { Actions } from 'vuex-smart-module';
import { AxiosError } from 'axios';
import { API } from '@/services/api';
import { AuthMutations } from './mutations';
import { AuthState } from './state';
import { SignIn } from '@/services/api/auth/types';

export class AuthActions extends Actions<
  AuthState,
  never,
  AuthMutations,
  AuthActions
> {
  async fetchAuth({ email, password }: SignIn) {
    try {
      const response = await API.auth.signIn({ email, password });
      localStorage.setItem('auth_token', response.data.token);
      this.mutations.refreshUser();
    } catch (error: any) {
      throw new Error(error.response.data.error);
    }
  }
}
