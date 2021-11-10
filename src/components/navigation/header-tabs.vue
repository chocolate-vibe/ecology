<template>
  <v-card>
    <v-tabs
      background-color="grey darken-3"
      class="rounded-0"
      :slider-color="$accent"
      :color="$accent"
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.title"
        :to="tab.link"
        link
      >
        <v-icon>{{ tab.icon }}</v-icon>&nbsp;{{ tab.title }}
      </v-tab>
    </v-tabs>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Navigation extends Vue {
  @Prop() private readonly tabs!: {
    title?: string,
    link?: string,
    icon?: string,
  };
}
</script>
<style lang="sass"></style>
