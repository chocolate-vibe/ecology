/* eslint-disable import/no-cycle */
import { ILesson } from './lesson';
import { ITeacher } from './teacher';

export interface IEducationGroup {
  id: number,
  title?: string,
  teacher?: ITeacher,
  lessons?: ILesson[],
}
