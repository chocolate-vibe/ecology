/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { VueConstructor } from 'vue';
import { IRole } from '@/types/role';

const AccessPlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$isAdmin = () => {
      // const { role } = Vue.$auth.user;
      // return role.value === 'admin';
      return true;
    };

    Vue.prototype.$getMyRole = (): IRole => {
      // const { role } = Vue.$auth.user;
      // return role;
      return {
        id: 1,
        value: 'admun',
        description: 'Администратор',
      };
    };

    Vue.prototype.$getMyName = () => {
      // const { firstName, lastName } = Vue.$auth.user;
      // if (firstName || lastName) return `${firstName} ${lastName}`;
      // return '';
      return 'Датан Саинтистов';
    };

    Vue.prototype.$getUserInitials = (user: any) => {
      if (user) return `${user.firstName[0]}${user.lastName[0]}`;
      return '??';
    };
    Vue.prototype.$getUserFullName = (user: any, reverse = false) => {
      if (reverse) return `${user.lastName} ${user.firstName}`;
      return `${user.firstName} ${user.lastName}`;
    };
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $isAdmin(): boolean
    $getMyRole(): IRole
    $getMyName(): string
    $getUserInitials(user: any): string
    $getUserFullName(user: any, reverse?: boolean): string
  }
}

export default AccessPlugin;
