<template>
  <div class="feedback-drawer">
    <v-btn
      class="feedback-drawer__button"
      tile
      :color="$accent"
      @click="drawer = !drawer"
    >
      Обратная связь
    </v-btn>
    <v-navigation-drawer
      v-model="drawer"
      right
      absolute
      width="40%"
    >
      <slot />
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Feedbackrawer extends Vue {
  public drawer = false;

  close() {
    this.drawer = false;
  }
}
</script>

<style lang="scss" scoped>
.feedback-drawer {
  &__button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: rotate(90deg) translateY(-185%);
    border-radius: 0 0 10px 10px;
  }
}

::v-deep {
  .v-navigation-drawer__content {
    overflow: hidden;
  }
}
</style>
