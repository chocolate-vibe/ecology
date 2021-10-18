import { AxiosStatic } from 'axios';
import { AuthApi } from './types';

export default (axios: AxiosStatic): AuthApi => ({
  signIn({ login, password }) {
    return axios.get('/login', { params: { login, password } });
  },
});
