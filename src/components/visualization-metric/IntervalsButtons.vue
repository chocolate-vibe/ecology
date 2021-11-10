<template>
  <div class="interval-buttons d-flex flex-wrap align-content-start">
    <div
      v-for="{ from, to } in data"
      :key="`interval-button-${from}-${to}`"
      :data-tooltip="`Перемотать на ${$secondsToTime(from)}`"
      class="interval-button mr-2 mb-2"
    >
      <v-chip
        class="black--text"
        color="grey"
        @click="$emit('set-video-interval', { from, to })"
      >
        <v-icon left>mdi-motion-play</v-icon>
        {{ `${$secondsToTime(from)} - ${$secondsToTime(to)}` }}
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { buttonIntervalsValues } from '@/types/metric';

@Component({ name: 'IntervalButtons' })
export default class IntervalButtons extends Vue {
  @Prop() protected readonly data!: buttonIntervalsValues;
}
</script>

<style lang="scss" scoped>
.interval-button {
  position: relative;
}
</style>
