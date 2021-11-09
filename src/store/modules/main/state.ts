import { IEducationGroup } from '@/types/educationGroup';
import { ILesson } from '@/types/lesson';
import { ITeacher } from '@/types/teacher';

export class MainState {
  teamLeadersWithLessons: ITeacher[] = [];
  teachersWithLessons: ITeacher[] = [];
  teachersByTeamLeader: ITeacher[] = [];
  educationGroupsWithLessons: IEducationGroup[] = [];
  educationGroupsByTeacher: IEducationGroup[] = [];
  educationGroupsByTeamLeader: IEducationGroup[] = [];
  lessons: ILesson[] = [];
  isLoading = false;
  filtersApi: { [key: string]: any } = {};
  filterTeamLeader: ITeacher | null = null;
  filterTeacher: ITeacher | null = null;
  filterGroup: IEducationGroup | null = null;
  offset = 0;
}
