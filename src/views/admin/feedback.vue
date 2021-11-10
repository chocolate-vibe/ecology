<template>
  <div class="d-flex flex-row align-start">
    <v-list
      class="feedback__userlist grey darken-4 pa-0"
      three-line
    >
      <v-subheader
        class="pa-6 grey darken-2"
        v-text="'Преподаватели'"
      />
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
        mandatory
        :active-class="`${$accent}--text`"
        class="list-item-group"
      >
        <v-card class="feedback__user rounded-0">
          <v-list-item style="min-height: 50px">Все</v-list-item>
          <v-divider />
        </v-card>
        <v-card
          v-for="(user, index) in users"
          :key="`user-${index}`"
          class="feedback__user rounded-0"
        >
          <v-list-item>
            <v-list-item-avatar>
              <user-avatar
                :user="user"
                size="40"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="$getUserFullName(user)" />
              <v-list-item-subtitle>
                {{ user.comments[user.comments.length - 1].comment }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
        </v-card>
      </v-list-item-group>
    </v-list>
    <v-card
      outlined
      class="feedback__comments grey darken-3 rounded-0"
    >
      <v-list
        class="pa-0"
        two-line
      >
        <v-subheader
          class="pa-6 grey darken-2"
          v-text="'Комментарии'"
        />
        <v-list-item-group
          v-model="selectedComments[selectedItem]"
          :active-class="`${$accent}--text`"
          multiple
          class="list-item-group grey darken-4"
        >
          <!-- eslint-disable-next-line vue/no-lone-template -->
          <template v-for="comment in commentsList[selectedItem]">
            <v-list-item
              :key="`comment-${comment.id}`"
              style="position: relative"
            >
              <user-avatar
                :user="comment.user"
                size="40"
              />
              <v-list-item-content
                data-tooltip="Перейти к уроку"
                @click="openLessonPage(comment.lessonId)"
              >
                <v-list-item-title v-text="$getUserFullName(comment.user)" />

                <v-list-item-subtitle
                  class="text--primary"
                  v-text="`Урок ${comment.lessonId}`"
                />

                <v-list-item-subtitle v-text="comment.comment" />
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="$formattingTimeDate(comment.updatedAt, ' ')"
                />
                <div style="position: relative;">
                  <div :data-tooltip="comment.status ? 'Все пользователи видят этот коментрий' : 'Пользователи не видят этот коментрий'">
                    <v-icon
                      :color="comment.status ? 'green' : 'red lighten-1'"
                      @click.stop="changeCommentStatus(comment.id, comment.status)"
                    >
                      {{ comment.status ? 'mdi-eye-check' : 'mdi-eye-off' }}
                    </v-icon>
                  </div>
                </div>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="`divider-${comment.id}`" />
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// Types
import { IFeedback } from '@/types/feedback';
import { IUser } from '@/types/user';
// Components
import Comment from '@/components/comments/Comment.vue';
import UserAvatar from '@/components/UserAvatar.vue';
// Api
import { API } from '@/services/api';
// Store
import { store } from '@/store';

@Component({
  components: {
    Comment,
    UserAvatar,
  },
})
export default class extends Vue {
  public comments: IFeedback[] = [];
  public users: IUser[] = [];
  public selectedItem = 0;
  public selectedComments: Array<[]> = [];
  public newStatus = false;
  public commentsList: any = [];

  async mounted() {
    this.comments = (await API.feedback.fetchAll()).data;
    this.users = (await API.users.getUsersWithComments()).data;
    this.setCommentsList();
  }

  setCommentsList() {
    const list = [this.comments, ...this.users.map((user) => user.comments)];
    list.forEach(() => this.selectedComments.push([]));
    this.commentsList = list;
  }

  openLessonPage(lessonId: number) {
    const route = this.$router.resolve({ name: 'openLessonPage', params: {}, path: `/lesson/${lessonId}` });
    window.open(route.href, '_blank');
  }

  async changeCommentStatus(commentId: number, newStatus: boolean) {
    try {
      const { id, status } = (await API.feedback.updateStatus(commentId, !newStatus)).data;
      this.commentsList.forEach((arrayComments: IFeedback[]) => {
        arrayComments.forEach((comment: IFeedback) => {
          if (comment.id === id) comment.status = status;
        });
      });
    } catch (error: any) {
      store.notify.mutations.showNotify({
        type: 'error',
        content: error,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item-group {
  overflow-x: hidden;
  height: 86vh;
  &::-webkit-scrollbar {
      width: 5px;
  }
  &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: gray;
  }
}
.v-subheader {
  height: 20px !important;
}

.v-item--active {
  background: --grey-darken-5 !important;
}

.feedback {
  &__userlist {
    width: 40%;
  }
  &__user {
    &:hover {
      cursor: pointer;
      box-shadow: -7px 0px 14px 0px rgba(0, 0, 0, 0.35) inset;
    }
  }
  &__comments {
    width: 60%;
    filter: brightness(113%);
  }
}
</style>
