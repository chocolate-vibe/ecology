import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import jwtDecode from 'jwt-decode';
import { IUser } from '@/types/user';
import { ERoles } from '@/types/role';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'lesson',
    component: () => import('@/views/lessons/lessons.vue'),
  },
  // {
  //   path: '/chart-line',
  //   name: 'ChartLine',
  //   meta: { roles: [ERoles.ADMIN, ERoles.USER] },
  //   component: () => import('@/views/ChartLine.vue'),
  // },
  // {
  //   path: '/chart-radar',
  //   name: 'ChartRadar',
  //   meta: { layout: 'Empty', roles: [ERoles.ADMIN, ERoles.USER] },
  //   component: () => import('@/views/ChartRadar.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * Проверка у пользователя соответствующей роли
 */
router.beforeEach((to, from, next) => {
  const requireRoles = to?.meta?.roles;
  if (requireRoles) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user: IUser = jwtDecode(token);
      if (requireRoles.includes(user.role?.value)) next();
      else next('/login');
    } else next('/login');
  } else next();
});

export default router;
