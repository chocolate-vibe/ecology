<template>
  <v-dialog
    :value="isOpened"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @input="$emit('close')"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>{{ clickedCoords.lng }} : {{ clickedCoords.lat }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-tabs
        v-model="selectedStation"
        align-with-title
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab
            v-for="station in data"
            :key="station.id"
          >
            {{ station.title }}
          </v-tab>
      </v-tabs>
      <v-tabs-items v-model="selectedStation">
        <v-tab-item
          v-for="station in data"
          :key="station.id"
        >
          <v-card flat>
            <map-stations-data-chart
              v-for="pollutant in station.pollutants"
              :key="pollutant.id"
              :pollutant="pollutant"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapStationsDataChart from './MapStationsDataChart.vue';
import { PreparedStationsData, PreparedStationsDataItem } from '@/services/api/measurements/types';

@Component({
  components: {
    MapStationsDataChart,
  },
})
export default class MapStationsDataModal extends Vue {
  @Prop({ type: Array, required: true })
  readonly data!: PreparedStationsData;
  @Prop(Boolean) readonly isOpened!: boolean;
  @Prop({ type: Object, required: true })
  readonly clickedCoords!: { lng: number, lat: number };

  selectedStation: PreparedStationsDataItem = this.data[0];
}
</script>

<style scoped>

</style>
