<template>
  <v-navigation-drawer permanent class="map-sidebar">
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-btn
          @click="$emit('click:login')"
          color="success"
          class="ml-2 mb-3 rounded-0"
        >
          Войти
        </v-btn>
      </v-list-item-content>
    </v-list-item>
    <pollutants-list @select="onPollutantSelect"/>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Map } from 'mapbox-gl';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { store } from '@/store';
import PollutantsList from './MapSidebar/PollutantsList.vue';
import { Pollutant } from '@/store/modules/pollutants/types';

@Component({
  components: {
    PollutantsList,
  },
})
export default class MapSidebar extends Vue {
  @Prop({ type: Object, required: true })
  readonly map!: Map;

  get storeData() {
    return {
      stations: store.stations.state.stations,
      stationMarkers: store.stations.state.stationMapMarkers,
      pollutants: store.pollutants.state.pollutants,
    };
  }

  onPollutantSelect(selectedPollutant: Pollutant) {
    this.$api.measurements.get({ pollutantId: selectedPollutant.id, date: new Date() });
    this.storeData.stations.forEach((station) => {
      const stationHasSelectedPollution = station.pollutants.some((pollutant) => (
        pollutant.id === selectedPollutant.id
      ));

      const marker = this.storeData.stationMarkers.find((m) => {
        const { lng, lat } = m.getLngLat();
        return lng === station.lng && lat === station.lat;
      });
      const markerEl = marker?.getElement();

      if (!markerEl) return;
      if (stationHasSelectedPollution) {
        markerEl.classList.add('map-marker__station_active');
      } else {
        markerEl.classList.remove('map-marker__station_active');
      }
    });
  }
}
</script>

<style scoped>

</style>
