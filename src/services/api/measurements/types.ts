import { AxiosResponse } from 'axios';

interface Measurement {
  station_id: number,
  concentration: number,
}

interface StationsDataItem {
  pollutant_id: number,
  concentration: number,
  reading_date: string,
  station_id: number,
}

export type StationsData = StationsDataItem[];
interface PreparedStationsDataPollutantProperty {
  readingDate: string,
  concentration: number
}

export interface PreparedStationsDataPollutant {
  id: number,
  title: string,
  properties: PreparedStationsDataPollutantProperty[],
}
export interface PreparedStationsDataItem {
  id: number,
  title: string,
  pollutants: PreparedStationsDataPollutant[],
}

export type PreparedStationsData = PreparedStationsDataItem[];

export type Measurements = Measurement[];

export interface MeasurementsApi {
  get: ({ pollutantId, date }: { pollutantId: number, date: Date }) => (
    Promise<AxiosResponse<Measurements>>
  ),
  getStationsData: ({ date, stations }: { date: Date, stations: number[] }) => (
    Promise<AxiosResponse<StationsData>>
  )
}
