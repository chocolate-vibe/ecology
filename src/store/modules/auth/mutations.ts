import { Mutations } from 'vuex-smart-module';
import jwtDecode from 'jwt-decode';
import { AuthState } from './state';

export class AuthMutations extends Mutations<AuthState> {
  refrashUser(): void {
    const token = localStorage.getItem('auth_token');
    if (token) this.state.user = jwtDecode(token);
    else this.state.user = undefined;
  }
}
