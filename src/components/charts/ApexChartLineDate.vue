<template>
  <div id="chart">
    <div class="toolbar">
      <button
        id="one_month"
        @click="updateData('one_month')"
        :class="{ active: selection === 'one_month' }"
      >
        1M
      </button>

      <button
        id="six_months"
        @click="updateData('six_months')"
        :class="{ active: selection === 'six_months' }"
      >
        6M
      </button>

      <button
        id="one_year"
        @click="updateData('one_year')"
        :class="{ active: selection === 'one_year' }"
      >
        1Y
      </button>

      <button
        id="ytd"
        @click="updateData('ytd')"
        :class="{ active: selection === 'ytd' }"
      >
        YTD
      </button>

      <button
        id="all"
        @click="updateData('all')"
        :class="{ active: selection === 'all' }"
      >
        ALL
      </button>
    </div>

    <div id="chart-timeline">
      <apex-chart
        type="area"
        height="350"
        ref="chart"
        :options="chartOptions"
        :series="series"
      ></apex-chart>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Ref, Vue } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import axios from 'axios';
import { WindData } from '@/types/wind-data';

@Component({
  components: {
    ApexChart,
  },
})
export default class ApexLineChart extends Vue {
  @Ref('chart') private chart!: any;
  private windDataSet: WindData[] | null = null;
  private xLabels: Array<string> = [];
  private yValues: Array<number> = [];
  public chartData: any = {};

  public selection = 'one_year'
  public series = [
    {
      data: this.windDataSet?.map((el) => [
        Date.parse(el.datetime),
        el.windSpeed,
      ]),
      // [
      //   [1360882800000, 38.63],
      //   [1361228400000, 38.99],
      //   [1361314800000, 38.77],
      //   [1361401200000, 38.34],
      //   [1361487600000, 38.55],
      //   [1361746800000, 38.11],
      //   [1361833200000, 38.59],
      //   [1361919600000, 39.6],
      // ],
    },
  ];

  public chartOptions = {
    chart: {
      id: 'area-datetime',
      type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: '#999',
          label: {
            show: true,
            text: 'Support',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
      ],
      xaxis: [
        {
          x: new Date('14 Nov 2012').getTime(),
          borderColor: '#999',
          yAxisIndex: 0,
          label: {
            show: true,
            text: 'Rally',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    xaxis: {
      type: 'datetime',
      min: new Date('01 Mar 2012').getTime(),
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  updateData(timeline: any): void {
    this.selection = timeline;
    const today = new Date().getTime();
    const filterData = new Date();
    switch (timeline) {
      case 'one_month':
        filterData.setMonth(filterData.getMonth() - 1);
        this.chart.zoomX(
          filterData,
          today,
        );
        break;
      case 'six_months':
        filterData.setMonth(filterData.getMonth() - 6);
        this.chart.zoomX(
          filterData,
          today,
        );
        break;
      case 'one_year':
        filterData.setMonth(filterData.getFullYear() - 1);
        this.chart.zoomX(
          filterData,
          today,
        );
        break;
      // case 'ytd':
      //   this.chart.zoomX(
      //     new Date('01 Jan 2013').getTime(),
      //     new Date('27 Feb 2013').getTime(),
      //   );
      //   break;
      case 'all':
        this.chart.zoomX(
          new Date('23 Jan 2012').getTime(),
          new Date('27 Feb 2013').getTime(),
        );
        break;
      default:
    }
  }

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
