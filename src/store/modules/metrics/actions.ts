import { Actions } from 'vuex-smart-module';
// eslint-disable-next-line import/no-cycle
import { MetricMutations } from './mutations';
import { MetricState } from './state';
import { API } from '@/services/api';

export class MetricActions extends Actions<
MetricState,
never,
MetricMutations,
MetricActions
> {
  async init(lessonId: number) {
    await this.dispatch('getLesson', lessonId);
    await this.dispatch('getLessonMetrics', lessonId);
  }

  async getLesson(lessonId: number) {
    const lessonData = (await API.lesson.getLessonById(lessonId)).data;
    this.mutations.setLesson(lessonData);
  }
  async getLessonMetrics(lessonId: number) {
    const metrics = (await API.metric.getMetrics(lessonId)).data;
    this.mutations.setMetrics(metrics);
  }
}
