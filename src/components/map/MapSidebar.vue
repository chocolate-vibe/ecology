<template>
  <v-navigation-drawer permanent class="map-sidebar">
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-content v-if="!storeData.user">
        <v-btn
          @click="$emit('click:login')"
          color="success"
          class="ml-2 mb-3 rounded-0"
        >
          Войти
        </v-btn>
      </v-list-item-content>
      <v-list-item-content v-else class="d-flex align-items-center">
        <div>{{ storeData.user.login }}</div>
        <v-btn
          @click="logout()"
          color="info"
          class="ml-2 mb-3 rounded-0"
        >
          Выход
        </v-btn>
      </v-list-item-content>
    </v-list-item>
    <pollutants-list @select="onPollutantSelect"/>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Map } from 'mapbox-gl';
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { store } from '@/store';
import PollutantsList from './MapSidebar/PollutantsList.vue';
import { Pollutant } from '@/store/modules/pollutants/types';

const { setIsLoading } = store.root.mutations;

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
      user: store.auth.state.user,
    };
  }

  /**
   * Выход из профиля
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    store.auth.mutations.refrashUser();
  }

  async onPollutantSelect(selectedPollutant: Pollutant) {
    try {
      setIsLoading(true);
      const { data: measurements } = await this.$api.measurements.get({
        pollutantId: selectedPollutant.id,
        date: new Date(),
      });

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

        const concentrationEl = markerEl.querySelector('.map-marker__station-concentration') as HTMLDivElement;

        if (stationHasSelectedPollution) {
          markerEl.classList.add('map-marker__station_active');
          concentrationEl.innerHTML = '<div class="mdi mdi-alert-circle map-marker__station-concentration_empty"></div>';
        } else {
          markerEl.classList.remove('map-marker__station_active');
        }
        const stationMeasurement = measurements.find((measurement) => (
          measurement.station_id === station.id
        ));

        if (stationMeasurement && concentrationEl) {
          concentrationEl.innerHTML = String(stationMeasurement.concentration);
        } else if (!stationMeasurement && concentrationEl && !stationHasSelectedPollution) {
          concentrationEl.innerHTML = '';
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  mounted() {
    store.auth.mutations.refrashUser();
  }
}
</script>

<style scoped>

</style>
