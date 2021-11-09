/* eslint-disable import/no-cycle */
import { Module } from 'vuex-smart-module';
import root from './modules/root';
import chat from './modules/chat';
import notify from './modules/notify';
import feedback from './modules/feedback';
import metrics from './modules/metrics';
import main from './modules/main';
import auth from './modules/auth';

export default new Module({
  modules: {
    root,
    chat,
    notify,
    feedback,
    metrics,
    main,
    auth,
  },
});
