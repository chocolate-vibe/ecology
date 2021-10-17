import { AxiosResponse } from 'axios';
import { Stations } from '@/store/modules/stations/types';

interface NarestStation {
  lng: number,
  title: string,
  id: number,
  lat: number,
}

type NearestStations = NarestStation[];

export interface StationsApi {
  get: () => Promise<AxiosResponse<Stations>>,
  getNearest: ({ lat, lng }: { lat: number, lng: number }) => (
    Promise<AxiosResponse<NearestStations>>
  ),
}
