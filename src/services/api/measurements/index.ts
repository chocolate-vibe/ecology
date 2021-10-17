import { AxiosStatic } from 'axios';
import { formatDate } from '../helpers';
import { Measurements, MeasurementsApi } from './types';

const d: Date = new Date('2020-09-12 00:00:00');
console.log('date', d);

export default (axios: AxiosStatic): MeasurementsApi => ({
  get({ pollutantId, date }) {
    const formattedDate = formatDate(date);
    return axios.get<Measurements>(`/measurements/pollutant/${pollutantId}`, { params: { reading_date: formattedDate } });
  },
});
