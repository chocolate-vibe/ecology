import { FillLayer } from 'mapbox-gl';

export const hexLayer: FillLayer = {
  id: 'hex',
  type: 'fill',
  source: {
    type: 'geojson',
    data: './data/grid.geojson', // replace this with the url of your own geojson
  },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'value'],
      0,
      '#39af21',
      // 300,
      // '#EED322',
      // 800,
      // '#E6B71E',
      1100,
      '#eddc2a',
      // 1500,
      // '#CA8323',
      // 1700,
      // '#B86B25',
      // 1900,
      // '#A25626',
      // 2000,
      // '#8B4225',
      2180,
      '#ad2020',
    ],
    'fill-opacity': 0.8,
  },
};
