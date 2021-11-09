/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { VueConstructor } from 'vue';

const AccessPlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$formattingTimeDate = (date: string, separator = ' - ') => {
      const stringToDate = new Date(date);
      const dateToStringTime = stringToDate.toLocaleTimeString();
      const dateToStringDate = stringToDate.toLocaleDateString();
      return `${dateToStringTime}${separator}${dateToStringDate}`;
    };

    Vue.prototype.$formattingDate = (date: string) => {
      const stringToDate = new Date(date);
      return stringToDate.toLocaleDateString();
    };

    Vue.prototype.$formattingTime = (date: string) => {
      const stringToDate = new Date(date);
      return stringToDate.toLocaleTimeString();
    };

    Vue.prototype.$secondsToTime = (timeInSeconds: number): any => new Date(timeInSeconds * 1000).toISOString().substring(11, 19);
    Vue.prototype.$timeToSeconds = (timeString: string): number => {
      const timeArray = timeString.split(':');
      const [hours, minutes, seconds] = timeArray;
      return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    };
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $formattingTimeDate(date: string, separator?: string): string
    $formattingDate(date: string): string
    $formattingTime(date: string): string
    $secondsToTime(secNum: number): string
    $timeToSeconds(timeString: string): number
  }
}

export default AccessPlugin;
