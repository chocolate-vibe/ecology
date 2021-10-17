import axios from 'axios';
import Vue from 'vue';
import stations from './stations';
import pollutants from './pollutants';
import measurements from './measurements';
import auth from './auth';

axios.defaults.baseURL = 'http://178.154.229.14/api';

axios.interceptors.request.use((config) => {
  const updatedConfig = { ...config };
  const authToken = localStorage.getItem('auth_token') || process.env.VUE_APP_MAPBOX_ACCESS_TOKEN || '';

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

export const API = {
  stations: stations(axios),
  pollutants: pollutants(axios),
  measurements: measurements(axios),
  auth: auth(axios),
};

export default (): void => {
  Vue.prototype.$api = API;
};
