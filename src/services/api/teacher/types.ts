/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import { ITeacher } from '@/types/teacher';

export interface TeacherkApi {
  fetchTeachersWithLessons: () => Promise<AxiosResponse<ITeacher[]>>
  fetchTeamLeadersWithLessons: () => Promise<AxiosResponse<ITeacher[]>>
  fetchTeachersByTeamLeader: (teamLeaderId: number) => Promise<AxiosResponse<ITeacher[]>>
}
