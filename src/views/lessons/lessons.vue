<template>
  <div class="pa-6 d-flex flex-column">
    <div class="top-bar d-flex justify-space-beetween align-center pt-4">
      <v-combobox
        v-model="filterTeamLeader"
        :items="teamLeaders"
        clearable
        label="Выберите тимлидера"
        item-text="fullName"
        item-value="id"
        :color="$accent"
        outlined
        background-color="grey darken-4"
        hide-details
        class="top-bar__teamleader"
        @change="selectTeamLeader()"
      />
      <v-combobox
        v-model="filterTeacher"
        :items="teachers"
        clearable
        label="Выберите преподавателя"
        item-text="fullName"
        item-value="id"
        :color="$accent"
        outlined
        class="top-bar__teacher ml-3"
        background-color="grey darken-4"
        hide-details
        @change="selectTeacher()"
      />

      <v-combobox
        v-model="filterGroup"
        :items="educationGroups"
        width="false"
        clearable
        label="Выберите группу"
        :color="$accent"
        outlined
        hide-details
        class="top-bar__group ml-3"
        item-text="title"
        item-value="id"
        background-color="grey darken-4"
        @change="selectGroup()"
      />
    </div>
    <sort-button
      class="align-self-end my-3"
      @change="(order) => selectOrder(order)"
    />
    <div>
      <div class="video-list__container d-flex flex-wrap">
        <video-card
          v-for="(lesson, index) in lessons"
          :key="`${lesson.id}_${index}`"
          :lesson-id="lesson.id"
          :title="lesson.title"
          :teacher="lesson.educationGroup.teacher"
          :poster-url="lesson.previewSource"
          :date="lesson.updatedAt"
          :loading="isLoading"
          class="video-list__card mb-6"
        />
      </div>
    </div>
    <infinite-loading
      v-if="!getStateScroll"
      spinner="waveDots"
      class="grey--text"
      @infinite="fetchNextLessons"
    >
      <span slot="no-more" />
      <span slot="no-results">Нет результата...</span>
      <span slot="error">Ошибка...</span>
    </infinite-loading>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
// Types
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading';
import { ITeacher } from '@/types/teacher';
import { IEducationGroup } from '@/types/educationGroup';
import { store } from '@/store';
// Components
import VideoCard from '@/components/cards/VideoCard.vue';
import SortButton from '@/components/SortButton.vue';

@Component({
  components: {
    VideoCard,
    InfiniteLoading,
    SortButton,
  },
})
export default class LessonsPage extends Vue {
  protected onlyTeamLeaders = false;

  async mounted() {
    await store.main.actions.fetchTeamLeadersWithLessons();
    await store.main.actions.fetchTeachersWithLessons();
    await store.main.actions.fetchEducationGroupWithLessons();
    await store.main.actions.fetchLessonsByFilter();
  }

  /**
   * Состояние фильра по тим-лидерам
   */
  get filterTeamLeader(): ITeacher | null {
    return store.main.state.filterTeamLeader;
  }
  set filterTeamLeader(val: ITeacher | null) {
    store.main.mutations.setTeamLeader(val);
  }
  /**
   * Состояние фильра по учителям
   */
  get filterTeacher(): ITeacher | null {
    return store.main.state.filterTeacher;
  }
  set filterTeacher(val: ITeacher | null) {
    store.main.mutations.setTeacherFilter(val);
  }

  /**
   * Состояние фильра по группам
   */
  get filterGroup(): IEducationGroup | null {
    return store.main.state.filterGroup;
  }
  set filterGroup(val: IEducationGroup | null) {
    store.main.mutations.setGroupFilter(val);
  }

  /**
   * Состояние фильтра порядка по дате
   */
  get filterOrder(): string {
    return store.main.state.filterOrder;
  }
  set filterOrder(val: string) {
    store.main.mutations.setOrderFilter(val);
  }

  get lessons() {
    return store.main.state.lessons;
  }

  get teamLeaders() {
    return store.main.state.teamLeadersWithLessons;
  }

  get teachers() {
    return store.main.getters.teachers;
  }

  get educationGroups() {
    return store.main.getters.educationGroups;
  }

  get getStateScroll() {
    return store.main.getters.getStateScroll;
  }

  get isLoading() {
    return store.main.state.isLoading;
  }

  async selectTeamLeader() {
    this.filterGroup = null;
    this.filterTeacher = null;
    store.main.actions.fetchLessonsByFilter();
    if (this.filterTeamLeader) {
      await store.main.actions.fetchTeachersByTeamLeader(this.filterTeamLeader);
      await store.main.actions.fetchEducationGroupsByTeamLeader(
        this.filterTeamLeader,
      );
    }
  }

  async selectTeacher() {
    this.filterGroup = null;
    store.main.actions.fetchLessonsByFilter();
    if (this.filterTeacher) {
      await store.main.actions.fetchEducationGroupsByTeacher(
        this.filterTeacher,
      );
    }
    if (this.filterTeacher?.teamLeader) {
      this.filterTeamLeader = this.filterTeacher.teamLeader;
      await store.main.actions.fetchTeachersByTeamLeader(
        this.filterTeacher.teamLeader,
      );
    }
  }

  async selectGroup() {
    await store.main.actions.fetchLessonsByFilter();
    if (this.filterGroup?.teacher?.teamLeader) {
      this.filterTeamLeader = this.filterGroup.teacher.teamLeader;
      await store.main.actions.fetchTeachersByTeamLeader(
        this.filterGroup.teacher.teamLeader,
      );
    }
    if (this.filterGroup?.teacher) {
      this.filterTeacher = this.filterGroup.teacher;
      await store.main.actions.fetchEducationGroupsByTeacher(
        this.filterGroup.teacher,
      );
    }
  }

  async selectOrder(order: string) {
    if (this.filterOrder === order) return;
    this.filterOrder = order;
    await store.main.actions.fetchLessonsByFilter();
  }

  /**
   * При скролле страницы подгружает еще уроки
   */
  fetchNextLessons($InfiniteScrollState: StateChanger) {
    if (!this.getStateScroll) {
      setTimeout(() => {
        store.main.actions
          .addLessonsByFilter()
          .then((data: any) => {
            if (!data.length || data.length < 30) {
              $InfiniteScrollState.complete();
            } else $InfiniteScrollState.loaded();
          })
          .catch(() => $InfiniteScrollState.complete());
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  position: relative;
  width: 100%;
  &__teamleader {
    flex: 1 1 auto;
  }
  &__teacher {
    flex: 1 1 auto;
  }
  &__group {
    flex: 5 1 auto;
  }
}
.list {
  overflow-y: auto;
  height: 355px;
}
.list__item {
  padding: 15px;
  border-bottom: 1px solid #151414;
}
.time-code {
  border-radius: 5px;
  padding: 3px 5px;
  background: #2485ca;
  font-size: 12px;
  font-weight: 500;
  margin-right: 15px;
  cursor: pointer;
}
.md-app {
  max-height: 400px;
  border: 1px solid rgba(#000, 0.12);
}

.spinner-center {
  margin-left: 47%;
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.video-list {
  &__card {
    flex-basis: 23.5%;
    margin-right: 20px;
    &:nth-child(4n+4) {
      margin-right: 0;
    }
  }
}
</style>
