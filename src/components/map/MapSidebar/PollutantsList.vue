<template>
  <v-list two-line>
    <v-list-item-group
      v-model="selectedPollutant"
      active-class="primary--text"
      mandatory
    >
      <template v-for="(pollutant, index) in storeData.pollutants">
        <v-list-item
          :key="`item-${pollutant.id}`"
          :value="pollutant"
        >
          <v-list-item-content>
            <v-list-item-title v-text="pollutant.title"/>
            <v-list-item-subtitle
              class="text--primary"
              v-text="pollutant.code"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-if="index < storeData.pollutants.length - 1"
          :key="`devider-${pollutant.id}`"
        ></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import {
  Component, Vue, Watch,
} from 'vue-property-decorator';
import { store } from '@/store';
import { Pollutant } from '@/store/modules/pollutants/types';

  @Component
export default class PollutantsList extends Vue {
  selectedPollutant: Pollutant | null = null;

  get storeData() {
    return {
      pollutants: store.pollutants.state.pollutants,
    };
  }

  @Watch('selectedPollutant')
  selectedPollutantWatcher(val: Pollutant) {
    this.$emit('select', val);
  }
}
</script>

<style scoped>

</style>
