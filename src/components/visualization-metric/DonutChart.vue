<template>
  <div class="donut-chart">
    <vue-apex-charts
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { chartDonutExtendedValue, chartDonutExtendedValues } from '@/types/metric';

@Component({ name: 'DonutChart' })
export default class DonutChart extends Vue {
  @Prop() private readonly data!: chartDonutExtendedValues;
  @Prop() private readonly text?: any;
  private labelsList: string[] = [];
  private dataList: number[] = [];
  private colors: Array<string | { r: number, g: number, b: number }> = [];

  get series() {
    return this.dataList;
  }
  get chartOptions() {
    return {
      labels: this.labelsList,
      chart: { type: 'donut', height: 400 },
      colors: this.colors,
      legend: {
        position: 'left',
        markers: {
          width: 40,
          height: 15,
        },
        labels: { colors: '#fff' },
        formatter: (val: string, opts: any) => [val, ' - ', opts.w.globals.series[opts.seriesIndex]],
      },
      tooltip: {
        fillSeriesColor: false,
        onDatasetHover: {
          highlightDataSeries: true,
        },
      },
      stroke: { show: false },
      dataLabels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Roboto, Arial, sans-serif',
          fontWeight: 400,
          colors: ['#000'],
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            labels: {
              show: true,
              value: {
                color: '#959595',
                formatter: (w: any) => `${w} из ${this.text.norm.value}${this.text.norm.unit} (${this.text.norm.title.toLowerCase()})`,
              },
              total: {
                show: true,
                label: `${this.text.not_involved.title} ${this.text.not_involved.value}%${this.text.not_involved.unit ?? '%'}`,
                color: '#959595',
                fontSize: '15px',
                formatter(w: any) {
                  const sum = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                  return `Всего ${sum}`;
                },
              },
            },
          },
        },
      },
    };
  }

  @Watch('data')
  dataUpdated() {
    this.dataPreparation();
  }

  mounted() {
    this.dataPreparation();
  }

  dataPreparation() {
    this.data.forEach(({ value: name, count } : chartDonutExtendedValue) => {
      this.labelsList.push(name);
      this.dataList.push(count);
      this.colors.push(count ? this.$getStudentColor(name, 'HEX') : '#353535');
    });
  }
}
</script>

<style scoped>
.donut-chart {
  width: 60%;
}
</style>
