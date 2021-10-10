<template>
  <div class="line-chart__wrap">
    <radar-chart :chartData="chartData" :options="chartOptions" :height="200" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChartOptions, ChartData } from 'chart.js';
import RadarChart from '@/components/charts/Radar.vue';
import { WindData } from '@/types/wind-data';

@Component({
  components: {
    RadarChart,
  },
})
export default class RadarChartWind extends Vue {
  private windDataSet: WindData[] | null = null;
  private circleLabels: Array<string> = [];
  private radiusValues: Array<number> = [];

  //   private chartData: ChartData = {};
  public chartData: any = {};

  //   get chartOptions(): ChartOptions {
  get chartOptions() {
    return {
      legend: {
        position: 'top',
        display: true,
        labels: {
          fontColor: '#fff',
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
          },
        ],
      },
      onHover: (e: any, item: any) => {
        if (item.length) e.target.style.cursor = 'pointer';
        else e.target.style.cursor = 'default';
      },
    };
  }

  prepareData() {
      // eslint-disable-next-line no-unused-expressions
      this.windDataSet?.forEach((data: WindData) => {
        this.circleLabels.push(data.datetime);
        this.radiusValues.push(data.wind_direction);
      });
  }

  async mounted() {
    await this.fetchDataSets();
    this.prepareData();
    this.buildChart();
  }

  buildChart() {
    this.chartData = {
      labels: this.circleLabels,
      datasets: [{
        label: 'Wind direction',
        data: this.radiusValues,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    };
  }

  async fetchDataSets() {
    const { data } = await this.$axios.get<WindData[]>('/data/wind.json');
    this.windDataSet = data;
  }
}
</script>

<style lang="scss" scoped>
</style>
