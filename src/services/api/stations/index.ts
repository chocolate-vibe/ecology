import { AxiosStatic } from 'axios';
import { Stations } from '@/store/modules/stations/types';
import { StationsApi } from './types';

export default (axios: AxiosStatic): StationsApi => ({
  get() {
    return axios.get<Stations>('/stations');
  },
});
