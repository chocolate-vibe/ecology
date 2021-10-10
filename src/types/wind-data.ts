/* eslint-disable camelcase */
export interface WindData {
  datetime: string,
  wind_direction: number,
  wind_speed: number,
}

export type WindDataSet = WindData[]
