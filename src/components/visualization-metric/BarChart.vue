<template>
  <div class="bar-chart">
    <vue-apex-charts
      :options="chartOptions"
      :series="series"
      class="bar-chart__left"
    />
    <timestamp-buttons
      :data="timestamps"
      :colors="colors"
      @set-video-time="(time) => $emit('set-video-time', time)"
      class="bar-chart__right"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { chartBarValue, chartBarValues } from '@/types/metric';
import TimestampButtons from '@/components/visualization-metric/TimestampButtons.vue';

@Component({ name: 'BarChart', components: { TimestampButtons } })
export default class BarChart extends Vue {
  @Prop() private readonly data!: chartBarValues;
  private xNames: Array<string> = [];
  private yValues: Array<number> = [];
  private colors: Array<string> = [];
  private backgrounsColors: Array<string> = [];
  private timestamps: Array<number> = [];

  get series() {
    return [
      {
        name: 'Вероятность',
        data: this.yValues,
      },
    ];
  }
  get chartOptions() {
    return {
      theme: { mode: 'dark' },
      chart: {
        height: 350,
        type: 'bar',
        background: 'transparent',
        events: {
          click: (event: any, chartContext: any, config: any) => {
            const indexTarget = config.dataPointIndex;
            if (indexTarget !== -1) this.$emit('set-video-time', this.$timeToSeconds(this.xNames[indexTarget]));
          },
          mouseMove: (event: any, chartContext: any, config: any) => {
            // eslint-disable-next-line no-param-reassign
            if (config.dataPointIndex !== -1) event.target.style.cursor = 'pointer';
          },
        },
      },
      colors: this.colors,
      plotOptions: {
        bar: {
          columnWidth: '75%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: '#454545 ',
      },
      yaxis: {
        max: 100,
        labels: {
          formatter: (val : any) => `${val} %`,
        },
      },
      xaxis: {
        type: 'category',
        categories: this.xNames,
        tickPlacement: 'on',
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: true,
          style: {
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: any) => `${val}%`,
        },
      },
    };
  }

  prepareData() {
    this.data.forEach((timestamp: chartBarValue) => {
      this.xNames.push(this.$secondsToTime(timestamp.time));
      this.yValues.push(timestamp.proba);
      this.colors.push(this.$gradientColor(timestamp.proba));
      this.backgrounsColors.push(this.$gradientColor(timestamp.proba, 0.6));
      this.timestamps.push(timestamp.time);
    });
  }

  mounted() {
    this.prepareData();
  }
}
</script>

<style lang="scss" scoped>
.bar-chart {
  width: 100%;
  display: flex;
  &__left {
    width: 70%;
  }
  &__right {
    width: 30%;
  }
}
</style>
