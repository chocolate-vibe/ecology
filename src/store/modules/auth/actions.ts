import { Actions } from 'vuex-smart-module';
import { API } from '@/services/api';
import { AuthMutations } from './mutations';
import { AuthState } from './state';
import { AuthResponse } from '@/services/api/auth/types';

export class AuthActions extends Actions<
AuthState,
never,
AuthMutations,
AuthActions
> {
  async fetchAuth({ login, password }: { login: string, password: string }): Promise<AuthResponse> {
    const response = await API.auth.signIn({ login, password });
    localStorage.setItem('auth_token', response.data.token);
    this.mutations.refreshUser();
    return response;
  }
}
