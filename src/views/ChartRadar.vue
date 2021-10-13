<template>
  <div class="radar-chart__wrap">
    <radar-chart :chartData="chartData" :options="chartOptions" :height="150" />
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
  private radiusValues: Array<number> = [];
  private maxSpeed = 10;
  private color = 'grey';

  private directionsList = [
    'С',
    '',
    'CВ',
    '',
    'В',
    '',
    'ЮВ',
    '',
    'Ю',
    '',
    'ЮЗ',
    '',
    'З',
    '',
    'СЗ',
    '',
  ];

  get stepCircle(): number {
    return 360 / this.directionsList.length;
  }

  public chartData: ChartData = {};

  //   get chartOptions(): ChartOptions {
  get chartOptions(): ChartOptions {
    return {
      scale: {
        animate: false,
        ticks: {
          beginAtZero: true,
          min: 0,
          max: this.maxSpeed,
        },
        pointLabels: {
          fontSize: 18,
        },
      },
      legend: {
        position: 'left',
      },
      // onHover: (e: any, item: any) => {
      //   if (item.length) e.target.style.cursor = 'pointer';
      //   else e.target.style.cursor = 'default';
      // },
    };
  }

  getCoordinates(windDirection: number, windSpeed: number): number[] {
    const coordinates: number[] = [];
    if (!windDirection) return [];
    let directionIndx = 0;
    this.directionsList.forEach((name, indxLine) => {
      let radius = 0;
      const zoneBeforeLine = this.stepCircle * indxLine - this.stepCircle / 2;
      const zoneAfterLine = this.stepCircle * indxLine + this.stepCircle / 2;
      if (windDirection > zoneBeforeLine && windDirection < zoneAfterLine) {
        if (this.maxSpeed < windSpeed) this.maxSpeed = windSpeed;
        radius = windSpeed;
        directionIndx = indxLine;
        this.color = this.gradientColor(radius);
      }
      coordinates.push(radius);
    });
    if (directionIndx === 0) coordinates[this.directionsList.length - 1] = 1;
    else coordinates[directionIndx - 1] = 1;
    if (directionIndx === (this.directionsList.length - 1)) coordinates[0] = 1;
    else coordinates[directionIndx + 1] = 1;

    return coordinates;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    this.$isAdmin();
    await this.fetchDataSets();
    // eslint-disable-next-line no-unused-expressions
    if (this.windDataSet) {
      const data = this.windDataSet;
      let indx = 0;
      setInterval(() => {
        this.radiusValues = this.getCoordinates(
          data[indx].windDirection,
          data[indx].windSpeed,
        );
        indx += 1;
        this.buildChart();
      }, 1000);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  buildChart() {
    this.chartData = {
      labels: this.directionsList,
      datasets: [
        {
          label: 'Wind speed',
          data: this.radiusValues,
          fill: true,
          backgroundColor: this.color,
          borderWidth: 0,
          pointRadius: 0,
        },
      ],
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async fetchDataSets() {
    const { data } = await this.$axios.get<WindData[]>('/data/wind.json');
    this.windDataSet = data;
  }

  gradientColor(percent: number): string {
    const value = (percent * 100) / this.maxSpeed;
    if (value > 75) return '#E1BF4F';
    if (value > 50) return '#69CE83';
    if (value > 25) return '#5B93E3';
    return '#A470E7';
  }
}
</script>

<style lang="scss" scoped>

</style>
