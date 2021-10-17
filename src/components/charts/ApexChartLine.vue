<template>
  <div id="chart">
    <apex-chart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apex-chart>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Vue } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import axios from 'axios';
import { WindData } from '@/types/wind-data';
import WindDataSet from './wind.json';

@Component({
  components: {
    ApexChart,
  },
})
export default class ApexLineChart extends Vue {
  private windDataSet: WindData[] | null = null;
  private xLabels: Array<string> = [];
  private yValues: Array<number> = [];
  public chartData: any = {};

  get series() {
    return [
      {
        name: 'sales',
        data: WindDataSet.map((el) => ({
          x: el.datetime,
          y: el.windSpeed,
        })),
      },
    ];
  }

  public chartOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      // zoom: {
      //   type: 'x',
      //   enabled: true,
      //   autoScaleYaxis: true,
      // },
      // toolbar: {
      //   autoSelected: 'zoom',
      // },
    },
    dataLabels: {
      enabled: false,
    },
    // markers: {
    //   size: 0,
    // },
    title: {
      text: 'Stock Price Movement',
      align: 'left',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    // yaxis: {
    //   labels: {
    //     formatter(val: any) {
    //       return (val / 1000000).toFixed(0);
    //     },
    //   },
    //   title: {
    //     text: 'Price',
    //   },
    // },
    xaxis: {
      // categories: this.xLabels,
      type: 'category',
    },
    // tooltip: {
    //   shared: false,
    //   y: {
    //     formatter(val: any) {
    //       return (val / 1000000).toFixed(0);
    //     },
    //   },
    // },
  };

  async mounted() {
    await this.fetchDataSets();
  }

  async fetchDataSets() {
    const { data } = await axios.get<WindData[]>('/data/wind.json');
    this.windDataSet = data;
  }
}
</script>

<style lang="scss" scoped>
</style>
