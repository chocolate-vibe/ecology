<template>
  <v-app
    ma-0
    pa-0
  >
    <v-main>
      <v-container
        fluid
        ma-0
        pa-0
      >
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {}

</script>

<style lang="sass" scoped>

</style>
