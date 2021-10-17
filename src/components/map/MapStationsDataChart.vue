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
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import { PreparedStationsDataPollutant } from '@/services/api/measurements/types';

@Component({
  components: {
    ApexChart,
  },
})
export default class ApexLineChart extends Vue {
  @Prop({ required: true })
  readonly pollutant!: PreparedStationsDataPollutant;

  get series() {
    return [
      {
        name: 'sales',
        data: this.pollutant.properties.map((el) => ({
          x: el.readingDate,
          y: el.concentration,
        })),
      },
    ];
  }

  get chartOptions() {
    return {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
      },
      dataLabels: {
        enabled: false,
      },
      curve: 'smooth',
      title: {
        text: this.pollutant.title,
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
      xaxis: {
        type: 'category',
      },
    };
  }
}
</script>
