import { Mutations } from 'vuex-smart-module';
import { IEducationGroup } from '@/types/educationGroup';
import { ILesson } from '@/types/lesson';
import { ITeacher } from '@/types/teacher';
import { MainState } from './state';

function addFullName(teacher: ITeacher) {
  teacher.fullName = `${teacher.lastName} ${teacher.firstName}`;
  return teacher;
}

function setFullNames(teacher: ITeacher) {
  if (teacher) teacher = addFullName(teacher);
  if (teacher?.teamLeader) teacher.teamLeader = addFullName(teacher.teamLeader.teamLeader);
  return teacher;
}

export class MainMutations extends Mutations<MainState> {
  setTeamLeadersWithLessons(teamLeaders: ITeacher[] | []) {
    this.state.teamLeadersWithLessons = teamLeaders.map((teamLeader) => setFullNames(teamLeader));
  }

  setTeachersWithLessons(teachers: ITeacher[] | []) {
    this.state.teachersWithLessons = teachers.map((teacher) => setFullNames(teacher));
  }

  setTeachersByTeamLeader(teachersByTeamLeader: ITeacher[] | []) {
    this.state.teachersByTeamLeader = teachersByTeamLeader.map((teacher) => setFullNames(teacher));
  }

  setEducationGroupsWithLessons(groups: IEducationGroup[] | []) {
    groups.forEach(({ teacher }) => {
      if (teacher) teacher = setFullNames(teacher);
    });
    this.state.educationGroupsWithLessons = groups;
  }

  setEducationGroupsByTeacher(groups: IEducationGroup[] | []) {
    groups.forEach(({ teacher }) => {
      if (teacher) teacher = setFullNames(teacher);
    });
    this.state.educationGroupsByTeacher = groups;
  }

  setEducationGroupsByTeamLeader(groups: IEducationGroup[] | []) {
    groups.forEach(({ teacher }) => {
      if (teacher) teacher = setFullNames(teacher);
    });
    this.state.educationGroupsByTeamLeader = groups;
  }

  addWebinars(lessons: ILesson[] | null) {
    if (lessons) this.state.lessons = [...this.state.lessons, ...lessons];
    this.state.offset = this.state.lessons.length;
  }

  setWebinars(lessons: ILesson[] | []) {
    this.state.lessons = lessons;
    this.state.offset = this.state.lessons.length;
  }

  setTeamLeader(teamLeader: ITeacher | null) {
    this.state.filterTeamLeader = teamLeader;
  }

  setTeacherFilter(teacher: ITeacher | null) {
    this.state.filterTeacher = teacher;
  }

  setGroupFilter(group: IEducationGroup | null) {
    this.state.filterGroup = group;
  }

  setOrderFilter(sort: string) {
    this.state.filterOrder = sort;
  }

  resetOffset() {
    this.state.offset = 0;
  }
}
