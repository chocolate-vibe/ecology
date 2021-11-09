import { Actions } from 'vuex-smart-module';
import { FeedbackState } from './state';
import { FeedbackMutations } from './mutations';
import { IFeedback } from '@/types/feedback';
import FeedbackApi from '@/api/feedback.api';


export class FeedbackActions extends Actions<
FeedbackState,
never,
FeedbackMutations,
FeedbackActions
> {
  public async fetchCommentsByLesson(lessonId: number) {
    const comments: IFeedback[] = await FeedbackApi.getCommenstByLesson(lessonId);
    this.mutations.setCommentsByLesson(comments);
  }
}
