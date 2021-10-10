import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import ChartLine from '@/views/ChartLine.vue';
import ChartRadar from '@/views/ChartRadar.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home,
  // },
  {
    path: '/chart-line',
    name: 'ChartLine',
    component: ChartLine,
  },
  {
    path: '/chart-radar',
    name: 'ChartRadar',
    component: ChartRadar,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
