/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import { IMetricData } from '@/types/metric';

export interface MetricApi {
  getMetrics: (lessonId: number) => Promise<AxiosResponse<IMetricData[]>>
}
