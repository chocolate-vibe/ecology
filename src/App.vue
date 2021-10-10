<template>
  <div id="app">
    <MapGl/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapGl from './components/MapGl.vue';

@Component({
  components: {
    MapGl,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">

</style>
