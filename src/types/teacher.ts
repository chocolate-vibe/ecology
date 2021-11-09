// eslint-disable-next-line import/no-cycle
import { IEducationGroup } from './educationGroup';

export interface ITeacher {
  id: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isTeamLeader?: boolean;
  teamLeader?: any;
  teachers?: ITeacher[];
  educatonGroups?: IEducationGroup[]
}
