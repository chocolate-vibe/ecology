<template>
  <div class="timestamp-buttons d-flex flex-wrap align-content-start">
    <div
      v-for="(time, index) in data"
      :key="`timestamp-button-${index}-${time}`"
      :data-tooltip="tooltips ? tooltips[index] : 'Перемотать'"
      class="timestamp-button mr-2 mb-2"
    >
      <v-chip
        :color="colors ? colors[index] : 'grey'"
        class="black--text"
        @click="$emit('set-video-time', time)"
      >
        <v-icon left>mdi-motion-play</v-icon>
        {{ typeof time === 'number' ? $secondsToTime(time) : time }}
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { buttonTimeValues } from '@/types/metric';

@Component({ name: 'TimestampButtons' })
export default class TimestampButtons extends Vue {
  @Prop() public readonly data!: buttonTimeValues;
  @Prop() public readonly colors?: Array<string> | undefined;
  @Prop() public readonly tooltips?: Array<string> | undefined;
}
</script>

<style lang="scss" scoped>
.timestamp-buttons {
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    background: --grey-darken-4;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: --grey-darken-3;
  }
}

.timestamp-button {
  position: relative;
}
</style>
