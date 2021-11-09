import { Actions } from 'vuex-smart-module';
import { MainMutations } from './mutations';
import { MainState } from './state';
import { ITeacher } from '@/types/teacher';
import LessonApi from '@/api/lesson.api';
import TeacherApi from '@/api/teacher.api';
import EducationGroupApi from '@/api/education-group.api';
import { MainGetters } from './getters';
import { store } from '@/store';

export class MainActions extends Actions<
MainState,
MainGetters,
MainMutations,
MainActions
> {
  public async fetchTeamLeadersWithLessons() {
    const teamLeaders = await TeacherApi.fetchTeamLeadersWithLessons();
    this.mutations.setTeamLeadersWithLessons(teamLeaders);
  }

  public async fetchTeachersWithLessons() {
    const teachers = await TeacherApi.fetchTeachersWithLessons();
    this.mutations.setTeachersWithLessons(teachers);
  }

  public async fetchEducationGroupWithLessons() {
    const groups = await EducationGroupApi.fetchEducationGroupWithLessons();
    this.mutations.setEducationGroupsWithLessons(groups);
  }

  public async fetchEducationGroupsByTeacher(teacher: ITeacher) {
    const groups = await EducationGroupApi.fetchEducationGroupsByTeacher(teacher.id);
    this.mutations.setEducationGroupsByTeacher(groups);
  }

  public async fetchEducationGroupsByTeamLeader(teacher: ITeacher) {
    const groups = await EducationGroupApi.fetchEducationGroupsByTeamLeader(teacher.id);
    this.mutations.setEducationGroupsByTeamLeader(groups);
  }

  public async fetchTeachersByTeamLeader(teamLeader: ITeacher) {
    const teachers = await TeacherApi.fetchTeachersByTeamLeader(teamLeader.id);
    this.mutations.setTeachersByTeamLeader(teachers);
  }

  public async fetchLessonsByFilter() {
    const lessons = await LessonApi.getLessonsByFilter({
      offset: 0,
      ...this.getters.getFiltersApi,
    });
    if (lessons.length) this.mutations.setWebinars(lessons);
    else {
      store.notify.mutations.showNotify({ type: 'info', content: 'Уроки не найдены', snackbar: { timeout: 600 } });
      this.mutations.setWebinars([]);
    }
  }

  public async addLessonsByFilter() {
    const lessons = await LessonApi.getLessonsByFilter({
      offset: this.state.offset,
      ...this.getters.getFiltersApi,
    });
    this.mutations.addWebinars(lessons);
    return lessons;
  }
}
