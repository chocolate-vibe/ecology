import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import jwtDecode from 'jwt-decode';
import { IUser } from '@/types/user';
import { Roles } from '@/types/role';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'empty' },
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    name: 'lessons',
    meta: { roles: [Roles.ADMIN, Roles.USER] },
    component: () => import('@/views/lessons/lessons.vue'),
  },
  {
    path: '/lesson/:id',
    name: 'lesson',
    meta: { roles: [Roles.ADMIN, Roles.USER] },
    component: () => import('@/views/lessons/lesson.vue'),
  },
  {
    path: '/admin/users',
    name: 'users',
    meta: { roles: [Roles.ADMIN] },
    component: () => import('@/views/admin/users.vue'),
  },
  {
    path: '/admin/feedback',
    name: 'feedback',
    meta: { roles: [Roles.ADMIN] },
    component: () => import('@/views/admin/feedback.vue'),
  },
  {
    path: '/admin/other',
    name: 'other',
    meta: { roles: [Roles.ADMIN] },
    component: () => import('@/views/admin/other.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to?.meta?.title ?? 'EDS Анализ видео';
  const roles = to?.meta?.roles;
  const token = localStorage.getItem('auth_token');
  if (roles && !token) next('/login');
  else if (roles && token) {
    const user: IUser = jwtDecode(token);
    if (roles.includes(user.role?.value)) next();
    else next('/');
  } else next();
});

export default router;
