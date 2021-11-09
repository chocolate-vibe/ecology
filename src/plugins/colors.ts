/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { VueConstructor } from 'vue';

type modificator = 'brightly'| 'pale' | 'dark';
type RGB = { r: number, g: number, b: number };
type format = 'RGB' | 'HEX';

const userColorsStore: { [userId: number]: string } = {};
const studentColorsStore: { [studentName: string]: RGB } = {};

const numberToHex = (c: number): string => { // конвертирует число в 16-ти битную строку
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const rgbGenerator = (modificator: modificator): RGB => {
  if (modificator === 'pale') { // бледные цвета
    const random = () => Math.floor(170 * Math.random()) + 86;
    return { r: random(), g: random(), b: random() };
  }

  if (modificator === 'dark') { // темные цвета
    const random = () => 190 - Math.floor(170 * Math.random());
    return { r: random(), g: random(), b: random() };
  }

  if (modificator === 'brightly') { // насыщенные цвета
    const rbg = [0, 255, (Math.floor(Math.random() * (256)))];
    const value1 = rbg.splice(Math.floor(Math.random() * rbg.length), 1)[0];
    const value2 = rbg.splice(Math.floor(Math.random() * rbg.length), 1)[0];
    const value3 = rbg[0];
    return { r: value1, g: value2, b: value3 };
  }
  return { r: 255, g: 255, b: 255 };
};

const rgbToHex = (rgb: RGB): string => { // конвертирует RGB цвет в hex 16-ти битный для css
  const { r, g, b } = rgb;
  return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}`;
};

const AccessPlugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$colorRandomRGB = (modificator: modificator = 'pale'): RGB | undefined => rgbGenerator(modificator);
    Vue.prototype.$colorRandomHEX = (modificator: modificator = 'pale'): string => rgbToHex(rgbGenerator(modificator));
    Vue.prototype.$getUserColor = (userId: number, modificator: modificator = 'dark'): string => {
      if (userColorsStore[userId]) return userColorsStore[userId];
      userColorsStore[userId] = rgbToHex(rgbGenerator(modificator));
      return userColorsStore[userId];
    };

    Vue.prototype.$getStudentColor = (studentName: string, format: format = 'RGB', modificator: modificator = 'pale'): RGB | string => {
      if (studentColorsStore[studentName]) {
        if (format === 'RGB') return studentColorsStore[studentName];
        return rgbToHex(studentColorsStore[studentName]);
      }
      studentColorsStore[studentName] = rgbGenerator(modificator);
      if (format === 'RGB') return studentColorsStore[studentName];
      return rgbToHex(studentColorsStore[studentName]);
    };

    Vue.prototype.$gradientColor = (percent: number, opacity = 1): string => {
      const whiteMix = 120;
      const maxBright = 255 - whiteMix;
      const gradient = maxBright * 2;
      const brightByValue = (percent * gradient) / 100;
      const rgb = { r: whiteMix, g: whiteMix, b: whiteMix };
      if (brightByValue <= maxBright) {
        rgb.r += maxBright;
        rgb.g += brightByValue;
      } else {
        rgb.r += gradient - brightByValue;
        rgb.g += maxBright;
      }
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    };
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $colorRandomRGB(modificator?: modificator): RGB
    $colorRandomHEX(modificator?: modificator): string
    $colorTextRandomRGB(): { r: number, g: number, b: number }
    $gradientColor(percent: number, opacity?: number): string
    $getUserColor(userId: number, modificator?: number): string
    $getStudentColor(studentName: string, format?: format, modificator?: number): RGB | string
  }
}

export default AccessPlugin;
