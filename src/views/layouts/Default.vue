<template>
  <v-main>
    <v-container
      fluid
      ma-0
      pa-0
    >
      <navigation
        v-if="isAdmin"
        :tabs="tabs"
      />
      <router-view />
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navigation from '@/components/navigation/header-tabs.vue';

@Component({
  components: {
    Navigation,
  },
})
export default class extends Vue {
  tabs = [
    { title: 'Пользователи', icon: 'mdi-account-search', link: '/admin/users' },
    { title: 'Обратная связь', icon: 'mdi-comment', link: '/admin/feedback' },
    { title: 'Другое', icon: 'mdi-all-inclusive-box', link: '/admin/other' },
  ];
  get isAdmin() {
    return this.$route.path.startsWith('/admin');
  }
}
</script>
