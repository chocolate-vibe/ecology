import { Actions } from 'vuex-smart-module';
import { FeedbackState } from './state';
import { FeedbackMutations } from './mutations';
import { IFeedback } from '@/types/feedback';
import { API } from '@/services/api';

export class FeedbackActions extends Actions<
FeedbackState,
never,
FeedbackMutations,
FeedbackActions
> {
  public async fetchCommentsByLesson(lessonId: number) {
    const comments: IFeedback[] = (await API.feedback.getCommenstByLesson(lessonId)).data;
    this.mutations.setCommentsByLesson(comments);
  }
}
