<template>
  <div class="intervals">
    <div
      class="mb-3"
      v-html="titleText"
    />
    <interval-buttons
      :data="data"
      class="interval-buttons"
      @set-video-interval="(time) => $emit('set-video-interval', time)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import IntervalButtons from '@/components/visualization-metric/IntervalsButtons.vue';
import { buttonIntervalsValues, ITextMetric } from '@/types/metric';

@Component({ name: 'Intervals', components: { IntervalButtons } })
export default class Intervals extends Vue {
  @Prop() protected readonly data!: buttonIntervalsValues;
  @Prop() protected readonly text?: ITextMetric | any;

  get titleText() {
    let titleText = '';
    Object.values(this.text).forEach((val: any) => {
      titleText += `${val.title}: ${val.value} ${val.unit}<br>`;
    });
    return titleText;
  }
}
</script>

<style lang="scss" scoped>
.intervals {
  width: 100%;
}
.interval-buttons {
  overflow-y: auto;
  overflow-x: hidden;
  height: 250px;
  width: 70%;
    &::-webkit-scrollbar {
      width: 5px;
      background: --grey-darken-4;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: --grey-darken-3;
    }
}

</style>
