import { Mutations } from 'vuex-smart-module';
import { IFeedback } from '@/types/feedback';
import { FeedbackState } from './state';

export class FeedbackMutations extends Mutations<FeedbackState> {
  setCommentsByLesson(comments: IFeedback[]) {
    this.state.commentsByLesson = comments;
  }
}
