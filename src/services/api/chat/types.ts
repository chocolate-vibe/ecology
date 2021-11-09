import { AxiosResponse } from 'axios';
import { IChatMessage } from '@/types/chat';

export interface ChatApi {
  getChatMessages: (lessonId: number) => Promise<AxiosResponse<IChatMessage[]>>
}
