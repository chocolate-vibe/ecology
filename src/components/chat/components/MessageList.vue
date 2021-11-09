<template>
  <div class="chat-message__wrap d-flex justify-space-between">
    <div class="chat-message__text text-body-2">
      <span
        :style="{ color: nameColor }"
        class="chat-message__name"
      >{{ name }}:</span>
      <span> {{ text }}</span>
    </div>
    <div class="chat-message__time">
      <span v-show="timeIsShow">{{ $secondsToTime(time) }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class MessageList extends Vue {
  @Prop({
    required: true,
    type: Number,
  })
  time!: number;

  @Prop({
    required: true,
    type: String,
  })
  name!: string;

  @Prop({
    required: true,
    type: String,
  })
  text!: string;

  @Prop({
    required: true,
    type: String,
  })
  nameColor!: string;

  @Prop({
    required: true,
    type: Boolean,
  })
  timeIsShow!: boolean;
}
</script>
<style lang="sass" scoped>
.chat-message__wrap
  display: flex
  padding: 2px 5px
.chat-message__text
  width: 78%
  padding: 1%
  word-wrap: break-word
.chat-message__time
  padding: 1%
  font-size: 11px
.chat-message__name
  font-weight: bold
</style>
