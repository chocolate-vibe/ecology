import { Pollutants } from '../pollutants/types';

export interface Station {
  id: number,
  title: string,
  lat: number,
  lng: number,
  pollutants: Pollutants
}

export type Stations = Station[];
