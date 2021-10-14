import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import api, { apiService } from './services/api';
import AccessPlugin from '@/plugins/access';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@/assets/styles/map.scss';

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.use(AccessPlugin);
Vue.use(api);

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  interface Vue {
    $api: typeof apiService;
  }
}

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
