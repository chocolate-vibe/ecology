<template>
  <div class="line-chart__wrap">
    <div class="line-chart__left">
      <div class="line-chart-tabs__wrap">
        <div
          v-for="(name, indx) in labels"
          :key="`${indx}${name}`"
          :style="{
            background: name === selectedTab ? colors[name] : '',
            color: name === selectedTab ? 'black' : ''
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
    <div class="line-chart__right">
      <div
        v-for="param in text"
        :key="param.title"
        class="pb-2 text-right"
        v-text="`${param.title}: ${param.value}${param.unit}`"
      />
      <chat
        :time="videoDuration"
        :messages="messagesByUser"
        :show-before-time="videoDuration"
        class="line-chart__chat mr-4"
        rewindable="true"
        @set-video-time="(time) => $emit('set-video-time', time)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ApexChart from 'vue-apexcharts';
import { chartLineExtandedValues, ITextMetric } from '@/types/metric';
import TimestampButtons from '@/components/visualization-metric/TimestampButtons.vue';
import { IChatMessage } from '@/types/chat';
import Chat from '@/components/chat/index.vue';

@Component({ name: 'LineChartExtanded', components: { TimestampButtons, Chat, ApexChart } })
export default class LineChartExtanded extends Vue {
  @Prop() protected readonly data!: Array<IChatMessage>;
  @Prop() protected readonly text!: ITextMetric;
  @Prop() protected readonly videoDuration!: number;

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
          text: 'Количество сообщений в чате ',
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
          formatter: (value: any, opts: any) => {
            if (value !== 0) return value;
          },
        },
      },
    };
  }

  get messagesByUsers(): chartLineExtandedValues {
    const messagesByUsers: chartLineExtandedValues = {};
    this.data.forEach((message) => {
      const { username } = message;
      if (!(username in messagesByUsers)) messagesByUsers[username] = [];
      messagesByUsers[username].push(message);
    });
    return messagesByUsers;
  }

  get messagesByUser(): Array<IChatMessage> {
    if (this.selectedTab === 'Все') return this.data;
    return this.messagesByUsers[this.selectedTab];
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

  get getSeries() {
    if (!this.messagesByUsers) return;
    const preparedData: any = {};
    const preparedDataAll: Array<any> = [];

    Object.keys(this.messagesByUsers).forEach((username) => {
      const messages = this.messagesByUsers[username];
      const timestamps = messages.map(({ time }) => time);

      const item = {
        name: username,
        color: this.colors[username],
        data: this.getCoordinates(timestamps),
      };
      preparedData[username] = [item];
      preparedDataAll.push(item);
    });
    return { Все: preparedDataAll, ...preparedData };
  }

  get labels() {
    return ['Все', ...Object.keys(this.messagesByUsers)];
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

.line-chart {
  &__wrap{
    width: 100%;
    display: flex;
  }

  &__left {
    width: 70%;
  }

  &__right {
    width: 30%;
  }

  &__chat {
    width: 100%;
    height: 426px;
  }
}

.line-chart-tabs__wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 15px;
  &:last-child {
    margin-right: none;
  }
}

.line-chart__tab {
  cursor: pointer;
  color: #adadad;
  &:hover {
    background: #364158;
    color: #fff;
  }
}

.line-chart__ {
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
