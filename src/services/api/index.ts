import axios from 'axios';
import Vue from 'vue';

import auth from './auth';
import chat from './chat';
import educationGroup from './education-group';
import feedback from './feedback';
import lesson from './lesson';
import metric from './metric';
import teacher from './teacher';
import users from './users';

axios.defaults.baseURL = `${process.env.VUE_APP_API_URL}/api`;

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
  auth: auth(axios),
  chat: chat(axios),
  educationGroup: educationGroup(axios),
  feedback: feedback(axios),
  lesson: lesson(axios),
  metric: metric(axios),
  teacher: teacher(axios),
  users: users(axios),
};

export default (): void => {
  Vue.prototype.$api = API;
};
