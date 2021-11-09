import { Actions } from 'vuex-smart-module';
import { ChatMutations } from './mutations';
import { ChatState } from './state';
import { IChatMessage } from '@/types/chat';
import { API } from '@/services/api';

export class ChatActions extends Actions<
ChatState,
never,
ChatMutations,
ChatActions
> {
  async fetchChatMessages(lessonId: number): Promise<void> {
    const chatMessages: Array<IChatMessage> | undefined = (await API.chat.getChatMessages(lessonId)).data;
    this.mutations.setMessages(chatMessages);
  }
}
