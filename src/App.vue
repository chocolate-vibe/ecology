<template>
    <v-app>
      <div class="d-flex app">
      <v-navigation-drawer permanent>
        <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-btn @click="setStyle('airPollution')">SHOW AIR POLLUTION</v-btn>
      <v-btn @click="setStyle('default')">SHOW DEFAULT</v-btn>
        <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view/>
      </v-main>
      </div>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  items = [
    {
      icon: 'asd',
      title: 'title',
    },
  ]
  styles = {
    default: 'mapbox://styles/jurybabenko/ckuirvwsuazyo17prtlqbtmir',
    airPollution: 'mapbox://styles/jurybabenko/ckumguwlaeiie18s0o9osxu6x',
  }
  selectedStyle = this.styles.default;

  setStyle(type: 'default' | 'airPollution'): void {
    this.selectedStyle = this.styles[type];
  }
}
</script>

<style lang="scss">
.app {
  height: 100%
}
</style>
