<template>
    <div>
      <div class="top-bar">
        <div class="d-flex justify-space-beetween align-center pt-4">
          <v-combobox
            v-model="filterTeamLeader"
            :items="teamLeaders"
            clearable
            label="Выберите тимлидера"
            item-text="fullName"
            item-value="id"
            color="green"
            outlined
            background-color="grey darken-4"
            hide-details
            @change="selectTeamLeader()"
            class="rounded-0"
          />
          <v-combobox
            v-model="filterTeacher"
            :items="teachers"
            clearable
            label="Выберите преподавателя"
            item-text="fullName"
            item-value="id"
            color="green"
            outlined
            class="ml-3 rounded-0"
            background-color="grey darken-4"
            hide-details
            @change="selectTeacher()"
          />
        </div>

        <v-combobox
          v-model="filterGroup"
          :items="educationGroups"
          width="false"
          clearable
          label="Выберите группу"
          color="green"
          outlined
          hide-details
          class="mt-4 rounded-0"
          item-text="title"
          item-value="id"
          background-color="grey darken-4"
          @change="selectGroup()"
        />
      </div>
      <div class="pa-6">
        <div
          class="video-list__container d-flex flex-wrap justify-space-around"
        >
          <video-card
            v-for="(lesson, index) in lessons"
            :key="`${lesson.id}_${index}`"
            :lesson-id="lesson.id"
            :title="lesson.title"
            :teacher="lesson.educationGroup.teacher"
            :poster-url="lesson.previewSource"
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
        <span slot="no-more"/>
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

@Component({
  components: {
    VideoCard,
    InfiniteLoading,
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
  padding: 3px 25px;
  width: 50%;
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

h3 {
  padding: 0.5%;
}

.video-list {
  &__card {
    flex-basis: 23%;
  }
}
</style>
