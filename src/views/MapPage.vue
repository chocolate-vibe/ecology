<template>
  <div class="map-page">
    <div class="d-flex map-page__content">
      <map-sidebar
        v-if="map && storeData.stations.length"
        :map="map"
        @click:login="showLoginPopup = true"
      />
      <v-main>
        <map-box-gl @map-rendered="setMap"/>
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
import { store } from '@/store';

@Component({
  components: {
    MapBoxGl,
    LoginPopup,
    MapSidebar,
  },
})
export default class MapPage extends Vue {
  showLoginPopup = false;
  map: Map | null = null;

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
}
</script>

<style lang="scss" scoped>
.map-page {
  &__content {
    height: 100vh;
  }
}
</style>
