import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import router from './router';
import { storeInstance } from './store';
import vuetify from './plugins/vuetify';
import api, { API } from './services/api';
import colorsPlugin from '@/plugins/colors';
import globalPlugin from '@/plugins/global';
import formattingPlugin from '@/plugins/formatting';

import '@/assets/styles/map.scss';

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.use(api);
Vue.use(colorsPlugin);
Vue.use(globalPlugin);
Vue.use(formattingPlugin);

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  interface Vue {
    $api: typeof API;
  }
}

new Vue({
  router,
  store: storeInstance,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
