<template>
  <div id="app">
    <component :is="layout" >
      <router-view />
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  get layout(): any {
    const layout = this.$route?.meta?.layout ?? 'Default';
    return () => import(`@/views/layouts/${layout}`);
  }
}
</script>

<style lang="scss">
.app {
  height: 100%;
}
</style>
