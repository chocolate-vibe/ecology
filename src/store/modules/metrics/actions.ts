import { Actions } from 'vuex-smart-module';
import { MetricMutations } from './mutations';
import { MetricState } from './state';
import MetricApi from '@/api/metric.api';
import LessonApi from '@/api/lesson.api';

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
    const lessonData = await LessonApi.getLessonById(lessonId);
    this.mutations.setLesson(lessonData);
  }
  async getLessonMetrics(lessonId: number) {
    const metrics = await MetricApi.getMetrics(lessonId);
    this.mutations.setMetrics(metrics);
  }

  // checkLesson() {
  //   if (this.state.lesson?.id) LessonApi.check(this.state.lesson.id);
  // }
}
