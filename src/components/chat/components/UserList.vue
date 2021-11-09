<template>
  <div class="chat-users__wrap">
    <ul
      v-for="(color, index) in userList"
      :key="index"
      class="chat-users-list__wrap"
    >
      <li class="chat-users-list__item">
        <v-icon :style="{ color: color }">mdi-account-circle</v-icon>
        <span
          :style="{ color: color }"
          class="chat-message__name"
        >{{ index }}:</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
export default class UsersComponent extends Vue {
    @Prop() userList!: [string];
}
</script>
<style lang="sass" scoped>
.chat-users-list__wrap
  list-style: none
</style>
