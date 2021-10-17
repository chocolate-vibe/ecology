<template>
  <div id="map" />
</template>

<script lang="ts">
import mapboxgl, {
  GeoJSONSource, Map, MapboxEvent, MapMouseEvent,
} from 'mapbox-gl';
import {
  Component, Vue,
} from 'vue-property-decorator';
import { Polygon } from 'geojson';
import { mapConfig } from '@/config';
// import { Stations } from '@/store/modules/stations/types';
import { createStationMarker } from '@/mapElements/markers/station';
// import { hexLayer } from '@/mapElements/layers/hex';
import grid2 from '../../../public/data/grid2.json';
import { store } from '@/store';
import { prepareStationsData } from '@/services/api/measurements/helpers';

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;

const { setIsLoading } = store.root.mutations;

@Component
export default class MapBoxGl extends Vue {
  map: Map | undefined;

  get storeData() {
    return {
      stations: store.stations.state.stations,
      pollutants: store.pollutants.state.pollutants,
    };
  }

  mounted(): void {
    const map = new mapboxgl.Map(mapConfig);
    this.map = map;
    this.$emit('map-rendered', map);

    map.on('load', this.onMapLoaded);
    map.on('preclick', this.onMapClicked);

    this.loadStations(map);
  }

  // @Watch('selectedStyle')
  styleWatcher(): void {
    if (!this.map) return;
    // this.map.setStyle(val);
    const source = this.map.getSource('hex') as GeoJSONSource;
    // eslint-disable-next-line no-undef
    source.setData(grid2 as GeoJSON.FeatureCollection<Polygon>);
  }

  onMapLoaded(e: MapboxEvent) {
    // const map = e.target;
    // map.addLayer(hexLayer);
    // map.moveLayer('hex', 'building-number-label');
  }

  async onMapClicked({ lngLat }: MapMouseEvent) {
    try {
      setIsLoading(true);
      const { data: nearestStations } = await this.$api.stations.getNearest({ ...lngLat });
      const { data: stationsData } = await this.$api.measurements.getStationsData({
        date: new Date(),
        stations: nearestStations.map((station) => station.id),
      });
      const preparedStationsData = prepareStationsData({
        data: stationsData,
        pollutants: this.storeData.pollutants,
        stations: this.storeData.stations,
      });

      this.$emit('click:map', {
        stationsData: preparedStationsData,
        lngLat,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async loadStations(map: Map): Promise<void> {
    try {
      await store.stations.actions.fetchStations();

      this.storeData.stations.forEach((station) => {
        createStationMarker(map, station);
      });
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style>
#map{position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
