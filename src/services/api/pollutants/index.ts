import { AxiosStatic } from 'axios';
import { PollutantsApi } from './types';
import { Pollutants } from '@/store/modules/pollutants/types';

export default (axios: AxiosStatic): PollutantsApi => ({
  get() {
    return axios.get<Pollutants>('/pollutants');
  },
});
