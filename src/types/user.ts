import { IRole } from '@/types/role';
import { IFeedback } from '@/types/feedback';

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
  role: IRole;
  comments?: IFeedback;
}

export interface IUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserDtoUpdate {
  id: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  activated?: boolean;
  roleId?: number;
}
export interface UserRoleUpdate {
  userId: number;
  value: string;
}
