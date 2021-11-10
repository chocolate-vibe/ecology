<template>
  <div class="line-chart__wrap">
    <div class="line-chart__left">
      <div class="line-chart-tabs__wrap">
        <div
          v-for="(name, indx) in labels"
          :key="`${indx}${name}`"
          :style="{
            background: name === selectedTab ? colors[name] : '',
            color: name === selectedTab ? 'black' : '',
          }"
          class="line-chart__tab py-1 px-2 mr-2"
          @click="selectedTab = name"
        >
          {{ name }}
        </div>
      </div>
      <apex-chart
        :options="chartOptions"
        :series="series"
      />
    </div>
    <timestamp-buttons
      v-if="timestampsButtons[selectedTab]"
      :data="timestampsButtons[selectedTab].timestamps"
      :colors="timestampsButtons[selectedTab].colors"
      :tooltips="timestampsButtons[selectedTab].tooltips"
      class="line-chart__right"
      @set-video-time="(time) => $emit('set-video-time', time)"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import { chartLineValues } from '@/types/metric';
import TimestampButtons from '@/components/visualization-metric/TimestampButtons.vue';

@Component({ name: 'LineChart', components: { TimestampButtons, ApexChart } })
export default class LineChart extends Vue {
  @Prop() private readonly data!: chartLineValues;
  @Prop() private readonly videoDuration!: number;

  private selectedTab = '';
  private yMax = 0;

  get series() {
    return this.getSeries?.[this.selectedTab];
  }

  get chartOptions() {
    return {
      chart: {
        height: 400,
        type: 'area',
        background: 'transparent',
      },
      theme: { mode: 'dark' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 1.5 },
      xaxis: {
        type: 'category',
        categories: this.xLinesNames,
        labels: {
          show: true,
          style: { colors: '#fff' },
          rotate: -45,
          rotateAlways: true,
        },
      },
      yaxis: {
        max: this.yMax,
        tickAmount: this.yMax,
        labels: {
          show: true,
          style: { colors: '#fff' },
          formatter: (value: any) => value,
        },
        title: {
          text: 'Обращения к ученикам',
          style: {
            color: '#555555',
            fontSize: '12px',
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 400,
          },
        },
      },
      grid: {
        borderColor: 'grey',
        xaxis: { lines: { show: true } },
      },
      legend: {
        position: 'left',
        markers: {
          width: 40,
          height: 15,
        },
      },
      tooltip: {
        y: {
          formatter: (value: any) => {
            if (value !== 0) return value;
          },
        },
      },
    };
  }

  /**
   * Параметры по оси X
   */
  private xLinesStep = 600; // 10 минут
  get xLinesCount() {
    return Math.ceil(this.videoDuration / this.xLinesStep);
  }
  get xLinesNames() {
    const names: string[] = [];
    for (let i = 0; i <= this.xLinesCount; i++) {
      const newScale = this.$secondsToTime(this.xLinesStep * i);
      names.push(newScale);
    }
    return names;
  }

  /**
   * Данные для кнопок с временными метками
   */
  get timestampsButtons() {
    const buttonsByNames: any = {};
    const buttonsAll: any = { colors: [], timestamps: [], tooltips: [] };

    this.data.forEach(({ value: name, time }) => {
      const colors: Array<string> = [];
      const timestamps: Array<number> = [];
      const tooltips: Array<string> = [];

      time.forEach((timestamp) => {
        colors.push(this.colors[name]);
        timestamps.push(timestamp);
        tooltips.push(name);
      });

      buttonsByNames[name] = { colors, timestamps, tooltips };
      buttonsAll.colors.push(...colors);
      buttonsAll.timestamps.push(...timestamps);
      buttonsAll.tooltips.push(...tooltips);
    });
    return {
      Все: buttonsAll,
      ...buttonsByNames,
    };
  }

  get getSeries() {
    if (!this.data) return;
    const preparedData: any = {};
    const preparedDataAll: Array<any> = [];

    this.data.forEach(({ value: name, time }) => {
      const item = {
        name,
        color: this.colors[name],
        data: this.getCoordinates(time),
      };
      preparedData[name] = [item];
      preparedDataAll.push(item);
    });

    return {
      Все: preparedDataAll,
      ...preparedData,
    };
  }

  get labels() {
    return ['Все', ...this.data.map(({ value }) => value)];
  }

  get colors() {
    const colors: any = {};
    this.labels.forEach((el) => {
      const color: any = this.$getStudentColor(el, 'HEX');
      colors[el] = color;
    });
    return colors;
  }

  @Watch('data')
  dataUpdated() {
    [this.selectedTab] = this.labels;
  }

  mounted() {
    [this.selectedTab] = this.labels;
  }

  getCoordinates(selectedData: any): number[] {
    const coordinates: number[] = [];
    if (!selectedData) return [];

    this.xLinesNames.forEach((nameLine, indxLine) => {
      let pointsOnLine = 0;
      selectedData.forEach((pointTime: number) => {
        const zoneBeforeLine = this.xLinesStep * indxLine - this.xLinesStep / 2;
        const zoneAfterLine = this.xLinesStep * indxLine + this.xLinesStep / 2;
        if (pointTime > zoneBeforeLine && pointTime < zoneAfterLine) {
          pointsOnLine++;
        }
      });
      if (this.yMax < pointsOnLine) this.yMax = pointsOnLine;
      coordinates.push(pointsOnLine);
    });
    return coordinates;
  }
}
</script>

<style lang="scss" scoped>
.line-chart-tabs__wrap {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 15px;
  &:last-child {
    margin-right: none;
  }
}

.line-chart {
  &__wrap {
    width: 100%;
    display: flex;
  }
  &__left {
    width: 70%;
  }
  &__right {
    margin: 95px 20px 0 20px;
    width: 30%;
    height: 303px;
  }
  &__tab {
    cursor: pointer;
    color: #adadad;
    &:hover {
      background: #364158;
      color: #fff;
    }
  }
}

.line-chart__tab_active {
  color: black;
  font-weight: 500;
  &:hover {
    color: black;
  }
}

::v-deep {
  .apexcharts-toolbar {
    z-index: 1;
  }
}
</style>
