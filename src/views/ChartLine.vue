<template>
  <div class="line-chart__wrap">
    <line-chart :chartData="chartData" :options="chartOptions" :height="150" />
    <apex-chart-line/>
    <apex-chart-line-date/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChartOptions, ChartData } from 'chart.js';
import LineChart from '@/components/charts/Line.vue';
import ApexChartLine from '@/components/charts/ApexChartLine.vue';
import ApexChartLineDate from '@/components/charts/ApexChartLineDate.vue';
import { WindData } from '@/types/wind-data';

@Component({
  components: {
    LineChart,
    ApexChartLine,
    ApexChartLineDate,
  },
})
export default class LineChartWind extends Vue {
  private windDataSet: WindData[] | null = null;
  private xLabels: Array<string> = [];
  private yValues: Array<number> = [];

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
        this.xLabels.push(data.datetime);
        this.yValues.push(data.windSpeed);
      });
  }

  async mounted() {
    await this.fetchDataSets();
    this.prepareData();
    this.buildChart();
  }

  buildChart() {
    this.chartData = {
      labels: this.xLabels,
      datasets: [{
        label: 'Wind speed',
        data: this.yValues,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 1,
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
