import { AxiosStatic } from 'axios';
import { IChatMessage } from '@/types/chat';
import { ChatApi } from './types';

export default (axios: AxiosStatic): ChatApi => ({
  getChatMessages(lessonId: number) {
    return axios.get<IChatMessage[]>(`/chat/${lessonId}`);
  },
});
