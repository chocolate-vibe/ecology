<template>
  <component :is="layout" >
    <router-view />
  </component>
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
</style>
