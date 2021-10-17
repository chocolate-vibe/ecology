<template>
  <div class="map-page">
    <div class="d-flex map-page__content">
      <map-sidebar
        v-if="map && storeData.stations.length"
        :map="map"
        @click:login="showLoginPopup = true"
      />
      <map-stations-data-modal
        v-if="stationsModal.data.length"
        :data="stationsModal.data"
        :clicked-coords="stationsModal.lngLat"
        :is-opened="stationsModal.isOpened"
        @close="stationsModal.isOpened = false"
      />
      <v-main>
        <map-box-gl
          @map-rendered="setMap"
          @click:map="onClickMap"
        />
      </v-main>
    </div>
    <login-popup v-model="showLoginPopup" @hide="showLoginPopup = false"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Map } from 'mapbox-gl';
import MapBoxGl from '@/components/map/MapBoxGl.vue';
import LoginPopup from '@/components/LoginPopup.vue';
import MapSidebar from '@/components/map/MapSidebar.vue';
import MapStationsDataModal from '@/components/map/MapStationsDataModal.vue';
import { store } from '@/store';
import { PreparedStationsData } from '@/services/api/measurements/types';

@Component({
  components: {
    MapBoxGl,
    LoginPopup,
    MapSidebar,
    MapStationsDataModal,
  },
})
export default class MapPage extends Vue {
  showLoginPopup = false;
  map: Map | null = null;
  stationsModal = {
    data: [] as PreparedStationsData,
    lngLat: { lng: 0, lat: 0 } as { lng: number, lat: number },
    isOpened: false,
  }

  get storeData() {
    return {
      stations: store.stations.state.stations,
    };
  }

  mounted() {
    store.pollutants.actions.fetchPollutants();
  }

  setMap(map: Map): void {
    this.map = map;
  }
  onClickMap({ stationsData, lngLat }: {
    stationsData: PreparedStationsData,
    lngLat: { lng: number, lat: number },
  }) {
    this.stationsModal.data = stationsData;
    this.stationsModal.lngLat = lngLat;
    this.stationsModal.isOpened = true;
  }
}
</script>

<style lang="scss" scoped>
.map-page {
  &__content {
    height: 100vh;
  }
}
</style>
