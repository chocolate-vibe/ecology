<template>
  <v-main>
    <v-container
      fluid
      ma-0
      pa-0
    >
      <router-view />
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>
