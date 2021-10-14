<template>
  <v-app>
    <div class="d-flex app">
      <login-popup v-model="showLoginPopup" @hide="showLoginPopup = false"/>
      <v-navigation-drawer permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6"> Application </v-list-item-title>
            <v-list-item-subtitle> subtext </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-btn @click="setStyle('airPollution')">SHOW AIR POLLUTION</v-btn>
        <v-btn @click="setStyle('default')">SHOW DEFAULT</v-btn>
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-btn
              @click="showLoginPopup = true"
              color="success"
              class="ml-2 mb-3 rounded-0"
            >
              Войти
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-navigation-drawer>
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginPopup from '@/components/LoginPopup.vue';

@Component({
  components: { LoginPopup },
})
export default class extends Vue {
  showLoginPopup = false;
  items = [
    {
      icon: 'asd',
      title: 'title',
    },
  ];
  styles = {
    default: 'mapbox://styles/jurybabenko/ckuirvwsuazyo17prtlqbtmir',
    airPollution: 'mapbox://styles/jurybabenko/ckumguwlaeiie18s0o9osxu6x',
  };
  selectedStyle = this.styles.default;

  setStyle(type: 'default' | 'airPollution'): void {
    this.selectedStyle = this.styles[type];
  }
}
</script>

<style lang="sass" scoped>
</style>
