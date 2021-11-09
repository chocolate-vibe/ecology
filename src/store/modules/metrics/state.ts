import { ITextMetric, IVisualMetric } from '@/types/metric';
import { ILesson } from '@/types/lesson';

export class MetricState {
  lesson: ILesson | null = null;
  renderListMetrics: { [section: number]: { [subsection: number]: IVisualMetric } } = {};
  textMetrics: Array<ITextMetric> = [];
  loaded = false;
  sections: { [section: number]: string } = {};
}
