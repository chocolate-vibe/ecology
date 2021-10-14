import { AxiosResponse } from 'axios';
import { Stations } from '@/types/stations';

export interface StationsApi {
  get: () => Promise<AxiosResponse<Stations>>
}
