import { INotify } from '@/types/inotify';

export class NotifyState {
  paramsNotify: INotify = {
    border: 'left',
    type: 'info',
  };
  paramsSnackbar = {
    timeout: 3000,
    top: true,
  };
}
