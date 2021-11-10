/* eslint-disable max-len */
/* eslint-disable no-shadow */
import { IChatMessage } from './chat';

export type visualType = 'chart_line' | 'chart_line_extended' | 'chart_bar' | 'button_time' | 'chart_radar' | 'chart_donut' |'chart_donut_extended' |'text' | 'button_intervals' // убрать button_time_prob после замены на bar_plot

export type visualizationComponent = 'LineChart' | 'LineChartExtanded' | 'BarChart' | 'DonutChart' | 'PolarChart' | 'TimestampButtons' | 'Text' | 'Intervals' | 'LessonInfo';
export enum VisualizationComponents {
  chart_line_extended = 'LineChartExtanded',
  chart_line = 'LineChart',
  chart_bar = 'BarChart',
  button_intervals = 'Intervals',
  button_time = 'TimestampButtons',
  chart_donut_extended = 'DonutChart',
  chart_donut = 'DonutChart',
  chart_radar = 'PolarChart',
  text = 'LessonInfo'
}

// New types
export type buttonTimeValue = number
export type buttonIntervalsValue = { from: number, to: number }
export type chartBarValue = { proba: number, time: number }
export type chartLineValue = { value: string, time: Array<number> }
export type chartRadarValue = { key: string, value: number }
export type chartDonutValue = { value: string, count: number }
export type chartDonutExtendedValue = { value: string, count: number }
export type chartHistExtendedValue = { value: string, time: Array<number> }

export type buttonTimeValues = Array<buttonTimeValue>
export type buttonIntervalsValues = Array<buttonIntervalsValue>
export type chartBarValues = Array<chartBarValue>
export type chartLineValues = Array<chartLineValue>
export type chartRadarValues = Array<chartRadarValue>
export type chartDonutValues = Array<chartDonutValue>
export type chartDonutExtendedValues = Array<chartDonutExtendedValue>
export type chartHistExtendedValues = Array<chartHistExtendedValues>
export type chartLineExtandedValues = { [username: string]: Array<IChatMessage> }

export type metricValues = buttonTimeValues | buttonIntervalsValues | chartBarValues | chartLineValues | chartRadarValues | chartDonutValues | chartDonutExtendedValues | chartHistExtendedValues | chartLineExtandedValues
export type metricValuesWithIntervals = buttonIntervalsValues
export type metricValuesWithPoints = chartLineValues | buttonTimeValues | chartBarValues

export interface ITextMetric { unit: string, title: string, value: string | number, alias: string, subtitle?: string }
export interface IVisualMetric {
  id: number;
  lessonId: number;
  value: metricValues | IChatMessage[] | undefined;
  visualization?: visualizationComponent
  text?: { [alias: string]: {unit: string, title: string, value: string | number} };
  title: string,
  visualType: visualType,
  priority?: number
}

export interface IMetricData {
  id: number;
  lessonId: number;
  metricType: string;
  visualType: visualType;
  verified?: boolean
  value: {
    text?: { [alias: string]: {unit: string, title: string, value: string | number} },
    value?: metricValues | IChatMessage[],
  };
  subsection: {
    id: number
    priority: number
    title: string,
    section: {id: number, priority: number, title: string}
  }
}
