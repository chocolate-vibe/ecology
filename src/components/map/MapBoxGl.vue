<template>
  <div id="map" />
</template>

<script lang="ts">
import mapboxgl, { GeoJSONSource, Map, MapboxEvent } from 'mapbox-gl';
import {
  Component, Vue,
} from 'vue-property-decorator';
import { Polygon } from 'geojson';
import { mapConfig } from '@/config';
import { Stations } from '@/types/stations';
import { createStationMarker } from '@/mapElements/markers/station';
import { hexLayer } from '@/mapElements/layers/hex';
import grid2 from '../../../public/data/grid2.json';

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;

@Component
export default class MapBoxGl extends Vue {
  map: Map | undefined;
  stations: Stations | null = null;

  mounted(): void {
    const map = new mapboxgl.Map(mapConfig);
    this.map = map;
    this.$emit('map-rendered', map);

    map.on('load', this.onMapLoaded);

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

  onMapLoaded(e: MapboxEvent): void {
    const map = e.target;
    console.log(map.getStyle());
    map.addLayer(hexLayer);
    map.moveLayer('hex', 'building-number-label');
  }

  async loadStations(map: Map): Promise<void> {
    try {
      const { data } = await this.$api.stations.get();
      this.stations = data;

      this.stations.forEach((station) => {
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
