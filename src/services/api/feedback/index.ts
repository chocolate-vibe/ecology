import { AxiosStatic } from 'axios';
import { FeedbackApi } from './types';
import {
  IFeedback, IFeedbackChangeStatus, IFeedbackDto, IFeedbackDtoUpdate,
} from '@/types/feedback';

export default (axios: AxiosStatic): FeedbackApi => ({
  fetchAll() {
    return axios.get<IFeedback[]>('/comments/');
  },

  getCommenstByLesson(lessonId: number) {
    return axios.get<IFeedback[]>(`/comments/lesson/${lessonId}/`);
  },

  create(comment: IFeedbackDto) {
    return axios.post('/comments', comment);
  },

  update(comment: IFeedbackDtoUpdate) {
    return axios.patch('/comments', comment);
  },

  delete(commentId: number) {
    return axios.delete<IFeedback>(`/comments/${commentId}`);
  },

  updateStatus(id: number, status: boolean) {
    return axios.patch<IFeedbackChangeStatus>('/comments', { id, status });
  },
});
