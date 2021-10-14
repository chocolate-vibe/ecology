<template>
  <div>
    <div id="map" />
  </div>
</template>

<script lang="ts">
import mapboxgl, { GeoJSONSource, Map } from 'mapbox-gl';
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { Polygon } from 'geojson';
// import { CombinedVueInstance } from 'vue/types/vue';
import { Stations } from '@/types/stations';
import { createStationMarker } from '@/mapElements/markers/station';
import { hexLayer } from '@/mapElements/layers/hex';
import grid2 from '../../public/data/grid2.json';

mapboxgl.accessToken = 'pk.eyJ1IjoianVyeWJhYmVua28iLCJhIjoiY2t1aXEybmI0MGNiODMzbzZjNGtzdXlqNSJ9.gS-vfgoZp8GARaYJN2j-1w';

@Component
export default class MapGl extends Vue {
  @Prop({ type: String }) readonly selectedStyle!: string;

  map: Map | undefined = undefined;
  // mapComponent: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = undefined;
  stations: Stations | null = null;

  mounted(): void {
    // const mapElement = document.createElement('div');
    // mapElement.setAttribute('id', 'map');
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/jurybabenko/ckuirvwsuazyo17prtlqbtmir', // style URL
      center: [37.50, 55.75], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    // console.log(mapElement);
    // document.getElementById('container')!.appendChild(mapElement);
    // const c = this.$createElement('div', )

    this.map.on('click', (e) => console.log(e));
    this.map.on('load', () => {
      this.map!.addLayer(hexLayer);
      this.map!.moveLayer('hex', 'building');
      console.log(this.map!.getStyle());
    });
    this.loadStations();
  }

  @Watch('selectedStyle')
  styleWatcher(val: string): void {
    if (!this.map) return;
    // this.map.setStyle(val);
    const source: GeoJSONSource = this.map.getSource('hex') as GeoJSONSource;
    console.log('grid2', grid2);
    // eslint-disable-next-line no-undef
    source.setData(grid2 as GeoJSON.FeatureCollection<Polygon>);
  }

  async loadStations(): Promise<void> {
    try {
      const { data } = await this.$api.stations.get();
      this.stations = data;

      this.stations.forEach((station) => {
        if (!this.map) return;
        createStationMarker(this.map, station);
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
