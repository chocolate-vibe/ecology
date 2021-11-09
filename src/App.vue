<template>
  <v-app ma-0 pa-0>
    <notify />
    <drawer/>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Notify from '@/components/Notify.vue';
import Drawer from '@/components/navigation/drawer.vue';

@Component({ components: { Notify, Drawer } })
export default class App extends Vue {
  get layout() {
    const layout = this.$route?.meta?.layout ?? 'default';
    return () => import(`@/views/layouts/${layout}`);
  }

  mounted() {
    this.$vuetify.theme.dark = true;
  }
}
</script>

<style lang="scss">
</style>
