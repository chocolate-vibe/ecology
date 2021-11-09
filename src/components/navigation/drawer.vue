<template>
  <v-navigation-drawer
    expand-on-hover
    app
    width="270"
    class="drawer"
  >
    <v-list>
      <v-list-item
        link
        class="px-2 list-item"
      >
        <v-list-item-avatar>
          <user-avatar
            :user="$auth.user"
            class="mr-2 mt-1"
            size="40"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ $getMyName() }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-subtitle-1">{{ $getMyRole().description }}</v-list-item-subtitle>
          <v-list-item-subtitle class="text-subtitle-2 font-weight-thin">{{ $auth.user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider/>

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in filtredList"
        :key="item.title"
        :to="item.link"
        link
        class="rounded-0"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-if="$auth.loggedIn"
        @click="logout()"
      >
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Выход </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UserAvatar from '@/components/UserAvatar.vue';

@Component({
  components: {
    UserAvatar,
  },
})
export default class Drawer extends Vue {
  list = [
    { title: 'Анализ уроков', icon: 'mdi-video-account', link: '/lesson/' },
    {
      title: 'Пользователи',
      icon: 'mdi-account-star',
      link: '/admin/users',
      disable: true,
      roles: ['admin'],
    },
    {
      title: 'Обратная связь',
      icon: 'mdi-comment',
      link: '/admin/feedback',
      roles: ['admin'],
    },
  ];

  get filtredList() {
    return this.list.filter((item) => {
      if (item.roles !== undefined) return item.roles.includes(this.$getMyRole().value);
      return true;
    });
  }

  async logout() {
    // await this.$auth.logout();
    alert('logout');
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  z-index: 99 !important;
}
.list-item {
  height: 80px;
}

.v-list-item:before {
  border-radius: 0 !important;
}
</style>
