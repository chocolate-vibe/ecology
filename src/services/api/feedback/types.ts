/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import {
  IFeedback, IFeedbackChangeStatus, IFeedbackDto, IFeedbackDtoUpdate,
} from '@/types/feedback';

export interface FeedbackApi {
  fetchAll: () => Promise<AxiosResponse<IFeedback[]>>
  getCommenstByLesson: (lessonId: number) => Promise<AxiosResponse<IFeedback[]>>
  create: (comment: IFeedbackDto) => Promise<AxiosResponse<IFeedback>>
  update: (comment: IFeedbackDtoUpdate) => Promise<AxiosResponse<IFeedback>>
  delete: (commentId: number) => Promise<AxiosResponse<IFeedback>>
  updateStatus: (id: number, status: boolean) => Promise<AxiosResponse<IFeedbackChangeStatus>>
}
