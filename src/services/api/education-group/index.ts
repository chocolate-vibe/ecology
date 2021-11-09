import { AxiosStatic } from 'axios';
import { EducationGroupApi } from './types';
import { IEducationGroup } from '@/types/educationGroup';

export default (axios: AxiosStatic): EducationGroupApi => ({
  fetchEducationGroupWithLessons() {
    return axios.get<IEducationGroup[]>('/education-groups');
  },

  fetchEducationGroupsByTeacher(teacherId: number) {
    return axios.get<IEducationGroup[]>(`/education-groups/teacher/${teacherId}`);
  },

  fetchEducationGroupsByTeamLeader(teamLeaderId: number) {
    return axios.get<IEducationGroup[]>(`/education-groups/team-leader/${teamLeaderId}`);
  },
});
