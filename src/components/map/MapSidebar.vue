<template>
  <v-navigation-drawer permanent class="map-sidebar">
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-account</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-btn
          @click="$emit('click:login')"
          color="success"
          class="ml-2 mb-3 rounded-0"
        >
          Войти
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Map } from 'mapbox-gl';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MapSidebar extends Vue {
  @Prop({ type: Object, required: true })
  readonly map!: Map;
}
</script>

<style scoped>

</style>
