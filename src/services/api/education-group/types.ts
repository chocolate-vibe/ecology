/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import { IEducationGroup } from '@/types/educationGroup';

export interface EducationGroupApi {
  fetchEducationGroupWithLessons: () => Promise<AxiosResponse<IEducationGroup[]>>
  fetchEducationGroupsByTeacher: (teacherId: number) => Promise<AxiosResponse<IEducationGroup[]>>
  fetchEducationGroupsByTeamLeader: (teamLeaderId: number) => Promise<AxiosResponse<IEducationGroup[]>>
}
