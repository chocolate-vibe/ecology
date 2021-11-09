import { Actions } from 'vuex-smart-module';
import { ChatMutations } from './mutations';
import { ChatState } from './state';
import { IChatMessage } from '@/types/chat';
import ChatApi from '@/api/chat.api';


export class ChatActions extends Actions<
ChatState,
never,
ChatMutations,
ChatActions
> {
  async fetchChatMessages(lessonId: number): Promise<void> {
    const chatMessages: Array<IChatMessage> | undefined = await ChatApi.getChatMessages(lessonId);
    this.mutations.setMessages(chatMessages);
  }
}
