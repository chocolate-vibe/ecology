<template>
  <div>
    <div id="map" />
  </div>
</template>

<script lang="ts">
import mapboxgl, { Map } from 'mapbox-gl';
import { Component, Vue } from 'vue-property-decorator';

mapboxgl.accessToken = 'pk.eyJ1IjoianVyeWJhYmVua28iLCJhIjoiY2t1aXEybmI0MGNiODMzbzZjNGtzdXlqNSJ9.gS-vfgoZp8GARaYJN2j-1w';

@Component
export default class MapGl extends Vue {
  map: Map | null = null;

  mounted(): void {
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/jurybabenko/ckuirvwsuazyo17prtlqbtmir', // style URL
      center: [37.50, 55.75], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    this.map.on('click', (e) => console.log(e));
  }
}
</script>

<style scoped>
#map{position: absolute; top: 0; bottom: 0; width: 100%;}
</style>
