/* eslint-disable no-shadow */
export enum ERoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IRole {
  id: number;
  value: string;
  description: string;
}

export interface IRoleDto {
  value: string;
  description: string;
}
