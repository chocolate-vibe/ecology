import { AxiosStatic } from 'axios';
import { AuthApi } from './types';

export default (axios: AxiosStatic): AuthApi => ({
  signIn() {
    return new Promise((resolve) => {
      resolve({ data: { token: process.env.VUE_APP_GUEST_TOKEN } });
    });
  },
});
