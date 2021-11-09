<template>
  <v-card class="statistic-card pa-3 d-flex justify-space-between flex-column align-end text-right grey darken-3">
    <span
      v-html="title"
      class="statistic-card__name text-caption font-weight-light grey--text"
    />
    <v-divider
      class="statistic-card__divider my-2"
      color="grey"
    />
    <div class="d-flex justify-space-between align-center statistic-card__value">
      <span
        v-text="subtitle"
        class="text-caption"
      />
      <span v-text="`${value} ${unit}`"/>
    </div>
    <v-btn
      :color="color"
      :style="`box-shadow: 1px 1px 8px -2px ${color};`"
      class="statistic-card__button"
      absolute
    >
      <v-icon x-large>{{ icon }}</v-icon>
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({ name: 'LessonInfo' })
export default class LessonInfo extends Vue {
  @Prop() private readonly title!: string;
  @Prop() private readonly subtitle!: string;
  @Prop() private readonly value!: string;
  @Prop() private readonly unit!: string;
  @Prop() private readonly color!: string;
  @Prop() private readonly icon!: string;
}
</script>

<style lang="scss" scoped>
.statistic-card{
  &__name {
    max-width: 70%;
    height: 40px;
  }
  &__divider {
    width: 100%;
  }
  &__value {
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
