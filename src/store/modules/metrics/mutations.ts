import { Mutations } from 'vuex-smart-module';
import { MetricState } from './state';
import { ILesson } from '@/types/lesson';
import { IMetricData, ITextMetric, IVisualMetric, VisualizationComponents } from '@/types/metric';
import { store } from '@/store';

export class MetricMutations extends Mutations<MetricState> {
  setLesson(lessonData: ILesson | undefined) {
    if (lessonData) {
      this.state.lesson = lessonData;
    }
  }

  setMetrics(metricsData: Array<IMetricData> | undefined) {
    if (metricsData !== undefined) {
      const metrics: { [section: number]: { [subsection: number]: IVisualMetric } } = {};
      const textMetrics: Array<ITextMetric> = [];
      const sections: { [section: number]: string } = {};
      metricsData.forEach((metric) => {
        try {
          const { subsection, id, lessonId, value, visualType, metricType } = metric;
          const { section } = subsection;

          if (visualType === 'chart_line_extended') value.value = store.chat.state.messages;
          if (visualType !== 'chart_line_extended' && value.text && (!value?.value || !value?.value?.length)) {
            Object.keys(value.text).forEach((paramKey) => {
              const param = value.text?.[paramKey];
              if (!param) return;
              if (metricType === 'common/statistics') textMetrics.push({ ...param, alias: paramKey });
              else textMetrics.push({ ...param, title: subsection.title, subtitle: param.title, alias: subsection.title });
            });
            return;
          }
          if (!((section.priority) in metrics)) {
            metrics[section.priority] = {};
            sections[section.priority] = section.title;
          }
          metrics[section.priority][subsection.priority] = {
            id,
            lessonId,
            visualType,
            title: subsection.title,
            text: value.text,
            value: value.value,
            visualization: VisualizationComponents[visualType],
          };
        } catch (e) { console.log(e); }
      });
      this.state.sections = sections;
      this.state.renderListMetrics = metrics;
      this.state.textMetrics = textMetrics;
      this.state.loaded = true;
    }
  }
}
