<template>
  <v-snackbar
    v-model="snackbar"
    v-bind="paramsSnackbar"
  >
    <v-alert
      v-bind="paramsNotify"
      @click="snackbar = false"
      tile
    >
      {{ paramsNotify.content }}
    </v-alert>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { store } from '@/store';

@Component
export default class Notify extends Vue {
  snackbar = false;

  get paramsNotify() {
    return store.notify.state.paramsNotify;
  }

  get paramsSnackbar() {
    return store.notify.state.paramsSnackbar;
  }

  @Watch('paramsNotify')
  showNotify() {
    this.snackbar = true;
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-snack__wrapper {
    display: block;
  }
  .v-snack__content {
    padding: 0;
  }
  .v-alert {
    margin: 0;
    cursor: pointer;
  }
}
</style>
