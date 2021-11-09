import { AxiosStatic } from 'axios';
import { AuthApi, SignIn } from './types';

export default (axios: AxiosStatic): AuthApi => ({
  signIn(params: SignIn) {
    return axios.post('/authorization/login', params);
  },
});
