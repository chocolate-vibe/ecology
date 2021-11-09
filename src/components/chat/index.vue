<template>
  <div
    class="chat__wrap"
  >
    <v-card class="chat__header grey darken-3 d-flex rounded-0">
      <div>
        <v-icon
          v-show="usersIsShow"
          @click="toggleChat()"
          dark
        >
          mdi-arrow-left
        </v-icon>
        Сообщения в чате
      </div>
      <v-menu
        v-if="false"
        bottom
        left
        style="float: right"
      >
        <!-- eslint-disable-next-line vue/no-lone-template -->
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            dark
          >
            <v-icon dark>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="toggleChat()">
            <v-list-item-title>
              <v-icon dark>mdi-account</v-icon> Участники
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <nuxt-link
                :to="`/chat/${$route.params.id}`"
                target="_blank"
              >
                <v-icon dark>mdi-open-in-new</v-icon> Открыть в новом окне
              </nuxt-link>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-icon dark>mdi-clock-time-four</v-icon> Показать или скрыть
              временныые метки
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>
    <div
      ref="ChatBody"
      @scroll="showScrollUp()"
      class="chat__body grey darken-4"
    >
      <div class="chat-body__inner  pb-5">
        <div
          style="
            font-size: 11px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin-bottom: 12px;
          "
        />
        <message-list
          v-show="!usersIsShow"
          v-for="(message, index) in showingMessages"
          :key="index"
          :time="message.time"
          :name="message.username"
          :text="message.message"
          :nameColor="$getStudentColor(message.username, 'HEX')"
          :timeIsShow="timeIsShow"
          @scroll="showScrollUp()"
          @click.native="rewindable ? $emit('set-video-time', message.time - 1) : ''"
          :style="{ cursor: rewindable ? 'pointer' : 'default' }"
          :data-tooltip="rewindable ? `Перемотать на ${$secondsToTime(message.time)}` : ''"
          class="chat-body__message"
        />
        <div
          style="
            font-size: 11px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin-bottom: 12px;
          "
        />
      </div>
      <div class="chat-scroll-up">
        <v-icon
          @click.native="scrollingToNewMessage()"
          v-show="!autoScrolling"
          class="chat-scroll-up__button green--text"
          large
        >
          mdi-arrow-down-circle
        </v-icon>
      </div>
      <!-- Scroll -->
      <div class="chat-scroll__wrap">
        <div class="chat-scroll__button"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// todo: Сделать плашку, если чат недосступен для этого урока
import { Component, Vue, Prop, Ref } from 'vue-property-decorator';
// Types
import { IChatMessage } from '@/types/chat';
// Components
import MessageList from '@/components/chat/components/MessageList.vue';
import UserList from '@/components/chat/components/UserList.vue';

@Component({
  components: {
    MessageList,
    UserList,
  },
})
export default class ChatComponent extends Vue {
  @Ref('ChatBody')
  private chatBodyElement!: HTMLDivElement;

  @Prop({ default: false }) readonly rewindable!: boolean;

  /**
   * Содержит список сообщений для отображения в чате
   */
  @Prop({ required: true })
  readonly messages!: IChatMessage[];

  /**
   * Отображает сообщения в чате до указанного времени
   * Если параметр не был передан, отображаются все сообщения
   */
  @Prop({ required: true })
  readonly showBeforeTime!: number;

  /**
   * Индикатор отображения времени в чате, при навидении курсора
   */
  private timeIsShow = true;

  /**
   * Индикатор отображения участников чата
   */
  private usersIsShow = false;

  /**
   * Индикатор отображения кнопки быыстрой прокрутки к последнему сообщению
   */
  private scrollUpIsShow = false;

  /**
   * Индикатар аввтоскрола
   */
  private autoScrolling = true;

  /**
   * Индикатар курсора над чатом
   */
  private cursorOverChat = false;

  /**
   * Содержит цвета для имен юзеров в сообщениях
   */
  private colorCache: { [key: string]: string } = {};

  /**
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *              GETTERS
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Возвращает сообщения доступные к указаному времени
   */
  get showingMessages() {
    if (!this.messages) return;
    const messages = this.messages.filter(
      (message) => message.time < this.showBeforeTime,
    );
    if (this.autoScrolling) this.scrollingToNewMessage();

    return messages;
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *         LIFECYCLE HOOKS
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  mounted() {
    if (window) {
      this.chatBodyElement.addEventListener('mouseenter', () => {
        this.cursorOverChat = true;
      });
      this.chatBodyElement.addEventListener('mouseleave', () => {
        this.cursorOverChat = false;
      });
      this.chatBodyElement.addEventListener('scroll', this.toggleAutoScroll);
    }
  }

  beforeDestroy() {
    this.chatBodyElement.removeEventListener('scroll', this.toggleAutoScroll);
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *              METHODDS
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Переключение автоскрола.
   * Отключается, когда пользователь скролит историю чата
   * @param {Event} event - собыытие при скролле чата
   * @returns
   */
  toggleAutoScroll() {
    if (this.cursorOverChat) {
      const topScrollHeight = Math.ceil(this.chatBodyElement.scrollTop);
      const chatHeight = this.chatBodyElement.scrollHeight;
      const lastMessageHeight = this.chatBodyElement.lastElementChild?.clientHeight || 0;

      // Определяем чата зону без автоскрола
      const heightScrollingDisabled = chatHeight - lastMessageHeight;

      if (topScrollHeight < heightScrollingDisabled) {
        this.autoScrolling = false;
      } else {
        this.autoScrolling = true;
      }
    }
  }

  /**
   * Прокурчивает чат к новому сообщению вниз.
   * Вызывается при появлении нового сообщения,
   * если ползователь не скроллит историю чата
   * @returns
   */
  scrollingToNewMessage() {
    if (this.chatBodyElement !== undefined) this.chatBodyElement.scrollTop = this.chatBodyElement.scrollHeight;
  }

  /**
   * Переключатель отображения времени при наведении курсора
   * @returns
   */
  toggleTime() {
    this.timeIsShow = !this.timeIsShow;
  }

  /**
   * Переключатель между отображением чата и участниками чата
   * @returns
   */
  toggleChat() {
    this.usersIsShow = !this.usersIsShow;
  }

  /**
   * Показать кнопку быстрой прокрутки к новым сообщеениям
   * @returns
   */
  showScrollUp() {
    if (this.autoScrolling !== true) this.scrollUpIsShow = true;
  }

  /**
   * Возвращает случаный цвет для имени пользователя и записывает его в кэш
   * @param {String} username - имя пользователя
   * @returns цвет для имени пользователя в чате
   */
  randomColor(username: string): string {
    const { r, g, b } = this.$colorRandomRGB();
    const color = this.colorCache[username]
      || (this.colorCache[username] = `rgb(${r}, ${g}, ${b})`);
    return color;
  }
}
</script>
<style lang="scss">

.chat__wrap {
  position: relative;
}
.chat__header {
  display: flex;
  width: 100%;
  padding: 1%;
  font-size: 15px;
  font-weight: bold;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box
}

.chat__body {
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 31px);
  padding-right: 5px;
  &::-webkit-scrollbar {
      width: 5px;
      background: $cstm-grey-darken-4;
  }
  &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: $cstm-grey-darken-3;
  }
}

.chat-body__inner {
  width: 100%;
}

.chat-body__message{
  transition: .3s;
  &:hover {
    filter: brightness(140%);
    background: $cstm-grey-darken-4;
  }
}

.chat-scroll-up {
  position: absolute;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
}
.chat-scroll-up__button {
  cursor: pointer;
}

/* Chat scroll */
// .chat-scroll__wrap {
//   width: 2%;
//   height: 100%;
//   background: #2c364a;
// }
.chat-scroll__button {
    width: 100%;
}

</style>
