/* eslint-disable max-len */
import { AxiosResponse } from 'axios';
import { IUser, IUserDto, IUserDtoUpdate } from '@/types/user';

export interface UsersApi {
  fetchAll: () => Promise<AxiosResponse<IUser[]>>
  create: (newUser: IUserDto) => Promise<AxiosResponse<IUser>>
  update: (comment: IUserDtoUpdate) => Promise<AxiosResponse<IUser>>
  getUsersWithComments: () => Promise<AxiosResponse<IUser[]>>
}
