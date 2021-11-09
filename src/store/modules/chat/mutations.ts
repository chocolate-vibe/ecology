import { Mutations } from 'vuex-smart-module';
import { IChatMessage } from '@/types/chat';
import { ChatState } from './state';

export class ChatMutations extends Mutations<ChatState> {
  setMessages(payload: IChatMessage[] | undefined) {
    if (payload) {
      this.state.messages = payload;
    }
  }
}
