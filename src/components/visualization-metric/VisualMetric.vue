<template>
  <!-- eslint-disable-next-line vue/require-component-is -->
  <component
    :is="getComponent"
    :data="value"
    :text="text"
    :video-duration="videoDuration"
    @set-video-time="(time) => $emit('set-video-time', time)"
    @set-video-interval="(time) => $emit('set-video-interval', time)"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { visualizationComponent, metricValues, ITextMetric } from '@/types/metric';
/* eslint-disable no-console */
@Component({ name: 'VisualMetric' })
export default class VisualMetric extends Vue {
  @Prop() public readonly visualization!: visualizationComponent;
  @Prop() public readonly videoDuration!: number | undefined;
  @Prop() public readonly value!: metricValues;
  @Prop({ required: false }) public readonly text?: ITextMetric;

  get getComponent() {
    if (this.visualization) return () => import(`@/components/visualization-metric/${this.visualization}.vue`);
    return null;
  }
}
</script>
