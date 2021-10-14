import axios from 'axios';
import Vue from 'vue';
import stations from './stations';
import auth from './auth';

axios.defaults.baseURL = 'http://178.154.229.14/api';

axios.interceptors.request.use((config) => {
  const updatedConfig = { ...config };
  const authToken = localStorage.getItem('auth_token');
  if (authToken && updatedConfig.headers) {
    updatedConfig.headers.Authorization = `Bearer ${authToken}`;
  }
  return updatedConfig;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(undefined, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.setItem('auth_token', '');
  }
  return Promise.reject(error);
});

export const apiService = {
  stations: stations(axios),
  auth: auth(axios),
};

export default (): void => {
  Vue.prototype.$api = apiService;
};
