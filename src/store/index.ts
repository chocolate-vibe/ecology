/* eslint-disable import/no-cycle */
import Vue from 'vue';
import Vuex from 'vuex';
import { createStore } from 'vuex-smart-module';
import baseModule from './baseModule';

Vue.use(Vuex);

export const storeInstance = createStore(
  baseModule,
);

console.log('STORE', baseModule.context(storeInstance));
export const store = baseModule.context(storeInstance).modules;
