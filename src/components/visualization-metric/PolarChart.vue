<template>
  <div class="polar-chart">
    <apex-chart
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import { chartRadarValue, chartRadarValues } from '@/types/metric';

@Component({ name: 'PolarChart', components: { ApexChart } })
export default class RadarChart extends Vue {
  @Prop() private readonly data!: chartRadarValues;
  @Prop() private readonly text?: any;
  private emotions: string[] = [];
  private values: number[] = [];
  private labelValues: number[] = [];
  private colors: Array<string | { r: number; g: number; b: number }> = [];
  private colorEmotions: { [emotion: string]: string } = {
    Злость: '#D64444',
    Отвращение: '#937B00',
    Страх: '#840072',
    Радость: '#8AFF59',
    Нейтральность: '#AAAAAA',
    Грусть: '#E5E510',
    Удивление: '#4ECDC4',

  };
  get series() {
    return this.values;
  }
  get chartOptions() {
    return {
      chart: {
        type: 'polarArea',
        height: 400,
        background: 'transparent',
      },
      theme: { mode: 'dark' },
      labels: this.emotions,
      colors: this.colors,
      fill: {
        opacity: 1,
        colors: this.colors,
      },
      yaxis: { show: false, tickAmount: 4 },
      xaxis: {
        type: 'category',
      },
      legend: {
        position: 'left',
        markers: {
          width: 40,
          height: 15,
        },
        formatter: (val: string, opts: any) => `${val} - ${this.labelValues[opts.seriesIndex]}%`,
      },
      plotOptions: {
        polarArea: {
          rings: { strokeColor: '#757575' },
          spokes: { connectorColors: '#757575' },
        },
      },
      tooltip: {
        fillSeriesColor: false,
        onDatasetHover: {
          highlightDataSeries: true,
        },
        y: {
          formatter: (val: any, opts: any) => `${this.emotions[opts.seriesIndex]} - ${this.labelValues[opts.seriesIndex]}%`,
        },
      },
    };
  }

  mounted() {
    this.dataPreparation();
  }

  @Watch('data')
  dataUpdated() {
    this.dataPreparation();
  }

  dataPreparation() {
    let max = 0;
    const values: Array<number> = [];
    const emotions: Array<string> = [];
    const colors: Array<string> = [];
    this.data.forEach(({ value, key: emotion }: chartRadarValue) => {
      values.push(value);
      emotions.push(emotion);
      colors.push(this.colorEmotions[emotion]);

      if (value > max) max = value;
    });
    this.labelValues = values;
    this.values = values.map((val) => Math.sqrt(val));
    this.emotions = emotions;
    this.colors = colors;
  }
}
</script>

<style lang="scss" scoped>
.polar-chart {
  width: 60%;
}
</style>
