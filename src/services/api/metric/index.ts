import { AxiosStatic } from 'axios';
import { IMetricData } from '@/types/metric';
import { MetricApi } from './types';

export default (axios: AxiosStatic): MetricApi => ({

  getMetrics(lessonId: number) {
    return axios.get<IMetricData[]>(`/metric/${lessonId}`);
  },
});
