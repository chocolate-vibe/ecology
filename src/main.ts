import Vue from 'vue';
import axios, { AxiosStatic } from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/assets/styles/map.scss';

Vue.config.productionTip = false;

const axiosConfig = {
  baseURL: '.',
};

Vue.prototype.$axios = axios.create(axiosConfig);
declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  interface Vue {
    $axios: AxiosStatic;
  }
}

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
