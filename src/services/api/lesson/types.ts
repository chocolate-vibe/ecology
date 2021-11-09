/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import { ILesson } from '@/types/lesson';

export interface LessonApi {
  getLessonById: (lessonId: number) => Promise<AxiosResponse<ILesson>>
  getLessonsByFilter: (params: { [key: string]: number | string | boolean }) => Promise<AxiosResponse<ILesson[]>>
}
