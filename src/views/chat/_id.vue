<template>
  <div>
    Чат id: {{ lessonId }}
    <div
      v-for="(message, index) in ChatMessages"
      :key="index"
    >
      Количество сообщений
      {{ message }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { store } from '@/store';

@Component
export default class ChatPage extends Vue {
  private readonly lessonId = parseInt(this.$route.params.id);
  get ChatMessages() {
    return store.chat.state.messages;
  }
}
</script>
<style lang="sass" scoped></style>
