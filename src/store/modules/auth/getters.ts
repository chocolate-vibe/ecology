import jwtDecode from 'jwt-decode';
import { Getters } from 'vuex-smart-module';
import { IUser } from '@/types/user';
import { AuthState } from './state';

export class AuthGetters extends Getters<AuthState> {
  get user(): IUser | undefined {
    if (this.state.user) return this.state.user;
    const token = localStorage.getItem('auth_token');
    if (token) return jwtDecode(token);
    return undefined;
  }
}
