import { AxiosStatic } from 'axios';
import { Stations } from '@/types/stations';
import { StationsApi } from './types';

export default (axios: AxiosStatic): StationsApi => ({
  get() {
    return axios.get<Stations>('http://178.154.229.14/api/stations');
  },
});
