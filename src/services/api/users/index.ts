import { AxiosStatic } from 'axios';
import { UsersApi } from './types';
import { IUser, IUserDto, IUserDtoUpdate } from '@/types/user';

export default (axios: AxiosStatic): UsersApi => ({
  fetchAll() {
    return axios.get<IUser[]>('/users/');
  },

  create(user: IUserDto) {
    return axios.post('/users', user);
  },

  update(user: IUserDtoUpdate) {
    return axios.patch('/users', user);
  },

  getUsersWithComments() {
    return axios.get<IUser[]>('/users/comments');
  },
});
