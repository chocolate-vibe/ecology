import { AxiosResponse } from 'axios';

interface Measurement {
  station_id: number,
  concentration: number,
}

export type Measurements = Measurement[];

export interface MeasurementsApi {
  get: ({ pollutantId, date }: { pollutantId: number, date: Date }) => (
    Promise<AxiosResponse<Measurements>>
  )
}
