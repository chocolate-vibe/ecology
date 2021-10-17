<template>
  <v-overlay
    :value="loading"
  >
    <v-progress-circular
      :size="size"
      color="primary"
      indeterminate
    />
  </v-overlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ type: Boolean, required: true }) readonly loading!: boolean;
  @Prop({ type: Number, default: 120 }) readonly size!: number;
}
</script>

<style scoped>

</style>
