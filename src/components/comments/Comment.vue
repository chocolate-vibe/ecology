<template>
  <div class="feedback__comment d-flex flex-row pt-3">
    <v-avatar
      :color="$getUserColor(user.id)"
      class="mr-2 mt-1"
    >
      <span class="white--text text-h5">{{ initials }}</span>
    </v-avatar>
    <v-textarea
      v-model="text"
      :append-outer-icon="
        !isMyComment ? '' : editable ? 'mdi-delete' : 'mdi-pencil'
      "
      :append-icon="editable && text && !rulesBroken ? 'mdi-check' : ''"
      @click:append-outer="() => editComment()"
      @click:append="() => saveComment()"
      :readonly="!editable"
      :color="color"
      :background-color="editable ? 'grey darken-2' : 'grey darken-3'"
      :label="label"
      :solo="editable"
      :disabled="!isMyComment"
      :rules="rules"
      :counter="editable"
      outlined
      auto-grow
      rows="1"
      class="body-2"
    />
    <v-snackbar
      v-model="snackbar"
      centered
      tile
      right
    >
      {{ 'Удалить этот комментарий?' }}
      <v-btn
        @click="deleteComment()"
        color="red"
        text
        class="ml-6"
      >
        Да
      </v-btn>
      <v-btn
        @click="snackbar = false"
        color="green"
        text
        class="ml-1"
      >
        Нет
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { API } from '@/services/api';
import { store } from '@/store';

@Component
export default class Comment extends Vue {
  @Prop() private readonly status!: boolean;
  @Prop() private readonly comment!: string;
  @Prop() private readonly id!: number;
  @Prop() private readonly createdAt!: string;
  @Prop() private readonly updatedAt!: string;
  @Prop() private readonly user!: {
    id: number;
    firstName: string;
    lastName: string;
  };

  private snackbar = false;
  private editable = false;
  private editedText: null | string = null;
  private newUpdatedAt: string | null = null;

  get text() {
    if (this.editedText === null) return this.comment;
    return this.editedText;
  }
  set text(val) {
    this.editedText = val;
  }

  get label() {
    const name = `${this.user.firstName} ${this.user.lastName[0]}.`;
    const created = this.$formattingTimeDate(this.createdAt);

    let updated = '';
    if (this.newUpdatedAt) updated = this.newUpdatedAt;
    else if (this.createdAt !== this.updatedAt) updated = this.updatedAt;
    if (updated) updated = ` — изменено ${this.$formattingTimeDate(updated)}`;

    return `${name} — ${created}${updated}`;
  }

  get isMyComment() {
    const { user } = store.auth.getters;
    return user?.id === this.user.id;
  }

  get color() {
    if (this.editable && !this.text) return 'red';
    return this.editable ? 'green' : 'white';
  }

  get initials() {
    return `${this.user.firstName[0]}${this.user.lastName[0]}`;
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

  async editComment() {
    if (!this.editable) this.editable = true;
    else this.snackbar = true;
  }

  async saveComment() {
    try {
      const response = await API.feedback.update({
        id: this.id,
        comment: this.text,
      });
      if (response.data) {
        this.newUpdatedAt = response.data.updatedAt;
        this.editable = false;
      }
    } catch (error: any) {
      store.notify.mutations.showNotify({ type: 'error', content: error });
    }
  }

  async deleteComment() {
    try {
      const result = await API.feedback.delete(this.id);
      if (result) this.destroySelf();
    } catch (error: any) {
      store.notify.mutations.showNotify({ type: 'error', content: error });
    }
  }

  destroySelf() {
    this.$destroy();
    return this?.$el?.parentNode?.removeChild(this.$el);
  }
}
</script>

<style lang="scss" scoped>
.feedback__comment {
  position: relative;
}

::v-deep {
  fieldset {
    border: none !important;
  }
  .v-label--active {
    font-size: 14px !important;
    margin-top: -10px !important;
  }
  textarea {
    // cursor: default !important;
    color: white !important;
  }
  .v-input__slot {
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
        cursor: default;
        border-radius: 17px 0 17px 0 !important;
  }
}
</style>
