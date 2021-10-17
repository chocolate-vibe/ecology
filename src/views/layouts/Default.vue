<template>
  <v-app>
    <router-view />
    <loader :loading="storeData.isLoading"/>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loader from '@/components/Loader.vue';
import { store } from '@/store';

@Component({
  components: {
    Loader,
  },
})
export default class LayoutDefault extends Vue {
  get storeData() {
    return {
      isLoading: store.root.state.isLoading,
    };
  }
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}
</style>
