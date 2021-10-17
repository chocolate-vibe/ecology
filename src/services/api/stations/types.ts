import { AxiosResponse } from 'axios';
import { Stations } from '@/store/modules/stations/types';

export interface StationsApi {
  get: () => Promise<AxiosResponse<Stations>>
}
