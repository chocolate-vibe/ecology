import { Actions } from 'vuex-smart-module';
import { MainMutations } from './mutations';
import { MainState } from './state';
import { ITeacher } from '@/types/teacher';
import { API } from '@/services/api';
import { MainGetters } from './getters';
import { store } from '@/store';

export class MainActions extends Actions<
MainState,
MainGetters,
MainMutations,
MainActions
> {
  public async fetchTeamLeadersWithLessons() {
    const teamLeaders = (await API.teacher.fetchTeamLeadersWithLessons()).data;
    this.mutations.setTeamLeadersWithLessons(teamLeaders);
  }

  public async fetchTeachersWithLessons() {
    const teachers = (await API.teacher.fetchTeachersWithLessons()).data;
    this.mutations.setTeachersWithLessons(teachers);
  }

  public async fetchEducationGroupWithLessons() {
    const groups = (await API.educationGroup.fetchEducationGroupWithLessons()).data;
    this.mutations.setEducationGroupsWithLessons(groups);
  }

  public async fetchEducationGroupsByTeacher(teacher: ITeacher) {
    const groups = (await API.educationGroup.fetchEducationGroupsByTeacher(teacher.id)).data;
    this.mutations.setEducationGroupsByTeacher(groups);
  }

  public async fetchEducationGroupsByTeamLeader(teacher: ITeacher) {
    const groups = (await API.educationGroup.fetchEducationGroupsByTeamLeader(teacher.id)).data;
    this.mutations.setEducationGroupsByTeamLeader(groups);
  }

  public async fetchTeachersByTeamLeader(teamLeader: ITeacher) {
    const teachers = (await API.teacher.fetchTeachersByTeamLeader(teamLeader.id)).data;
    this.mutations.setTeachersByTeamLeader(teachers);
  }

  public async fetchLessonsByFilter() {
    const lessons = (await API.lesson.getLessonsByFilter({
      offset: 0,
      ...this.getters.getFiltersApi,
    })).data;
    if (lessons.length) this.mutations.setWebinars(lessons);
    else {
      store.notify.mutations.showNotify({ type: 'info', content: 'Уроки не найдены', snackbar: { timeout: 600 } });
      this.mutations.setWebinars([]);
    }
  }

  public async addLessonsByFilter() {
    const lessons = (await API.lesson.getLessonsByFilter({
      offset: this.state.offset,
      ...this.getters.getFiltersApi,
    })).data;
    this.mutations.addWebinars(lessons);
    return lessons;
  }
}
