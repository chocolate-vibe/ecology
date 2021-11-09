// eslint-disable-next-line import/no-cycle
import { IEducationGroup } from './educationGroup';

export interface ILesson {
  id: number;
  title?: string;
  previewSource?: string;
  videoSource?: string;
  fps?: number;
  framesCount?: number;
  educationGroup: IEducationGroup;
}
