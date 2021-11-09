import { Mutations } from 'vuex-smart-module';
import { INotify } from '@/types/inotify';

import { NotifyState } from './state';

export class NotifyMutations extends Mutations<NotifyState> {
  showNotify(params: INotify) {
    this.state.paramsNotify = {
      ...this.state.paramsNotify,
      ...params,
    };

    this.state.paramsSnackbar = {
      ...this.state.paramsSnackbar,
      ...params.snackbar,
    };
  }
}
