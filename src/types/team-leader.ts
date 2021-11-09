import { ITeacher } from './teacher';

export interface ITeamLeader {
  id: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isTeamLeader?: boolean;
  teachers?: ITeacher[];
}
