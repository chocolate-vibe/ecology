import { MapboxOptions } from 'mapbox-gl';

export const mapConfig: MapboxOptions = {
  container: 'map', // container ID
  style: 'mapbox://styles/jurybabenko/ckuirvwsuazyo17prtlqbtmir', // style URL
  center: [37.50, 55.75], // starting position [lng, lat]
  zoom: 9, // starting zoom
};
