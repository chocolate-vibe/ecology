import { Stations } from '@/store/modules/stations/types';
import { Pollutants } from '@/store/modules/pollutants/types';
import { PreparedStationsData, StationsData } from './types';

export const prepareStationsData = ({ data, pollutants, stations }: {
  data: StationsData,
  pollutants: Pollutants,
  stations: Stations
}) => data.reduce((acc, curr) => {
  const station = acc.find((item) => item.id === curr.station_id);
  if (station) {
    const pollutant = station.pollutants.find((item) => (
      item.id === curr.pollutant_id
    ));
    if (pollutant) {
      pollutant.properties.push({
        readingDate: curr.reading_date,
        concentration: curr.concentration,
      });
    } else {
      const currPollutant = pollutants.find((item) => (
        item.id === curr.pollutant_id
      ));
      station.pollutants.push({
        id: curr.pollutant_id,
        title: currPollutant ? currPollutant.title : '',
        properties: [{
          readingDate: curr.reading_date,
          concentration: curr.concentration,
        }],
      });
    }
  } else {
    const currStation = stations.find((item) => (
      item.id === curr.station_id
    ));
    const currPollutant = pollutants.find((item) => (
      item.id === curr.pollutant_id
    ));
    acc.push({
      id: curr.station_id,
      title: currStation ? currStation.title : '',
      pollutants: [{
        id: curr.pollutant_id,
        title: currPollutant ? currPollutant.title : '',
        properties: [{
          readingDate: curr.reading_date,
          concentration: curr.concentration,
        }],
      }],
    });
  }

  return acc;
}, [] as PreparedStationsData);
