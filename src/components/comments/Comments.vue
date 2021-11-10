<template>
  <div class="comments__wrap">
    <div class="comments__header px-6 grey darken-3 text-body-2">
      <div>Обратная связь к метрике</div>
      <v-btn
        @click="$parent.$parent.close()"
        icon
        color="red lighten-3"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div
      v-if="!ChartComments.length && !newComments.length"
      class="comments__posted px-5 mt-6 grey--text darken-4 font-italic text-center"
    >
      Пока никто ничего не писал
    </div>
    <div
      v-else
      class="comments__posted px-5 pt-2"
    >
      <Comment
        v-for="(comment, index) in ChartComments"
        v-bind="comment"
        :key="`${index}_comments`"
      />
      <Comment
        v-for="(comment, index) in newComments"
        v-bind="comment"
        :key="`${index}_new_comments`"
      />
    </div>
    <v-textarea
      v-model="enteredText"
      :rules="rules"
      :label="rulesBroken? 'Превышено число символов 255' : 'Добавить комментарий'"
      :append-icon="!enteredText || rulesBroken ? '' : 'mdi-send'"
      @click:append="sendFeedback"
      filled
      counter
      auto-grow
      rows="4"
      class="comments__add rounded-0 text-body-2"
      color="green"
      hide-details
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IFeedback, IFeedbackDto } from '@/types/feedback';
import Comment from '@/components/comments/Comment.vue';
import { API } from '@/services/api';
import { store } from '@/store';

@Component({
  components: {
    Comment,
  },
})
export default class Comments extends Vue {
  /**
   * Имя графика к которому отображаем комментарии
   * Т.к. к одной метрике может быть множество графиков, для определения к
   * какому графику был оставлен комментарий
   */
  @Prop() private readonly chartName!: string;
  /**
   * Id метрики урока для коорой блок комментариев
   */
  @Prop() private readonly metricId!: number;
  /**
   * Id урока
   */
  @Prop() private readonly lessonId!: number;
  /**
   * Список всех комментариев для данного урока
   */
  @Prop() private readonly comments!: IFeedback[];
  /**
   * Введеный текст в форме добавления комментария
   */
  private enteredText = '';
  /**
   * Список новых добавленных комментариев пользователем для отображения
   */
  private newComments: Array<IFeedback|null> = [];

  /**
   * Возвращает из всех комментариев к уроку, комментарии к указанному графику
   */
  get ChartComments() {
    return this.comments.filter(({ processedDataId }) => processedDataId === this.metricId);
  }

  get CountComments() {
    return this.ChartComments.length + this.newComments.length;
  }

  /**
   * Правило, ограничивающее длину сообщения
   */
  private rulesBroken = false;
  get rules() {
    return [
      (v: any) => {
        if (v.length <= 255) {
          this.rulesBroken = false;
          return true;
        }
        this.rulesBroken = true;
        return 'Максимум 255 символов';
      },
    ];
  }
  /**
   * Отправка добавленного комментария
   */
  async sendFeedback() {
    const commentData: IFeedbackDto = {
      lessonId: this.lessonId,
      comment: this.enteredText,
      processedDataId: this.metricId,
    };
    try {
      const response = await API.feedback.create(commentData);
      if (response.data) {
        this.newComments.push(response.data);
        this.enteredText = '';
      }
    } catch (error: any) {
      store.notify.mutations.showNotify({ type: 'error', content: error });
    }
  }
}
</script>

<style lang="scss" scoped>
.comments {
  &__wrap {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    flex-grow: 0;
    div {
      line-height: 35px;
    }
  }
  &__posted {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 5px;
        background: var(--grey-darken-4);
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: var(--grey-darken-3);
    }
  }
  &__add {
    width: 100%;
    flex-grow: 0;
  }
  &__actions {
    text-align: right;
  }
}
</style>
