interface MaxAllowableConcentration {
  average: number,
  one_time: number,
  danger_class: number,
}

export interface Pollutant {
  id: number,
  max_allowable_concentration: MaxAllowableConcentration,
  title: string,
  code: string,
}

export type Pollutants = Pollutant[];
