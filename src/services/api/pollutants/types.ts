import { AxiosResponse } from 'axios';
import { Pollutants } from '@/store/modules/pollutants/types';

export interface PollutantsApi {
  get: () => Promise<AxiosResponse<Pollutants>>
}
