import { AxiosStatic } from 'axios';
import { TeacherkApi } from './types';
import { ITeacher } from '@/types/teacher';

export default (axios: AxiosStatic): TeacherkApi => ({
  fetchTeachersWithLessons() {
    return axios.get<ITeacher[]>('/teachers');
  },

  fetchTeamLeadersWithLessons() {
    return axios.get<ITeacher[]>('/teachers/team-leaders');
  },

  fetchTeachersByTeamLeader(teamLeaderId: number) {
    return axios.get<ITeacher[]>(`/teachers/team-leader/${teamLeaderId}`);
  },
});
