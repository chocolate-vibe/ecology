<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LayoutDefault extends Vue {
  showLoginPopup = false;
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}
</style>
