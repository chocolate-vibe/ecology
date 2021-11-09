<template>
  <statistic-cards :data="dataPrepared"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import StatisticCards from '@/components/cards/StatisticCards.vue';
import { IStatisticCard } from '@/types/common';

@Component({ name: 'TextMetric', components: { StatisticCards } })
export default class TextMetric extends Vue {
  @Prop() private readonly data!: any;

  get dataPrepared(): Array<IStatisticCard> {
    const data: Array<IStatisticCard> = [];
    Object.values(this.data).forEach((params: any) => {
      data.push({
        ...params,
        color:
          params.alias in this.colors
            ? this.colors[params.alias]
            : this.$colorRandomHEX(),
        icon: this.icons[params.alias],
      });
    });
    return data;
  }

  private colors: { [key: string]: string } = {
    date_fact: '#4CAF50',
    date_plan: '#00BCD4',
    attendance_lms: '#FB9637',
    attendance_zoom: '#2D8CFF',
    date_first_appearance: '#AB47BC',
    'Нарушения положения в кадре': '#FFEE58',
    'Нарушения видимости': '#FF5252',
    Жестикуляция: '#795548',
  };

  private icons: { [key: string]: string } = {
    date_fact: 'mdi-calendar-check',
    date_plan: 'mdi-calendar-month',
    attendance_lms: 'mdi-account-group',
    attendance_zoom: 'mdi-alpha-z-circle',
    date_first_appearance: 'mdi-video-check',
    'Нарушения положения в кадре': 'mdi-monitor-screenshot',
    'Нарушения видимости': 'mdi-eye-off',
    Жестикуляция: 'mdi-hand-wave',
  };
}
</script>

<style lang="scss" scoped>
.lesson-info {
  &__card {
    flex-basis: 19%;
  }
  &__name {
    max-width: 70%;
    height: 40px;
  }
  &__divider {
    width: 100%;
  }
  &__button {
    top: 0;
    left: 12px;
    transform: translateY(-30%);
    width: 70px !important;
    height: 70px !important;
    pointer-events: none !important;
  }
}
</style>
