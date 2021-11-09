<template>
  <div class="d-flex flex-wrap">
    <statistic-card
      v-for="(card, i) in data"
      :key="`statistic-card-${i}`"
      v-bind="card"
      class="statistic-cards__card mt-6 mb-2"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import StatisticCard from '@/components/cards/StatisticCard.vue';
import { IStatisticCard } from '@/types/common';

@Component({
  name: 'LessonInfo',
  components: { StatisticCard },
})
export default class LessonInfo extends Vue {
  @Prop() private readonly data!: IStatisticCard;
}
</script>

<style lang="scss" scoped>
.statistic-cards {
  &__card {
    flex: 0 0 auto;
    width: 260px;
    margin-right: 10px;
  }
}
</style>
