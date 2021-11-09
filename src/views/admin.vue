<template>
  <div>
    <Navigation :tabs="tabs"/>
    <NuxtChild/>
  </div>
</template>

<script lang="ts">
/**
 * @/pages/admin/page.vue
 * NuxtChild https://nuxtjs.org/docs/features/nuxt-components/#the-nuxtchild-component
 */
import { Component, Vue } from 'vue-property-decorator';
import Navigation from '@/components/navigation/header-tabs.vue';

@Component({ components: { Navigation } })
export default class extends Vue {
  tabs = [
    { title: 'Пользователи', icon: 'mdi-account-search', link: '/admin/users' },
    { title: 'Обратная связь', icon: 'mdi-comment', link: '/admin/feedback' },
    { title: 'Другое', icon: 'mdi-all-inclusive-box', link: '/admin/other' },
  ];
}
</script>

<style lang="sass" scoped></style>
