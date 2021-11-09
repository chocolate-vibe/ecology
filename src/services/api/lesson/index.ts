import { AxiosStatic } from 'axios';
import { ILesson } from '@/types/lesson';
import { LessonApi } from './types';

export default (axios: AxiosStatic): LessonApi => ({

  getLessonById(lessonId: number) {
    return axios.get<ILesson>(`/lesson/${lessonId}`);
  },

  getLessonsByFilter(params: { [key: string]: number | string | boolean }) {
    return axios.post('/lesson/filter', params);
  },
});
