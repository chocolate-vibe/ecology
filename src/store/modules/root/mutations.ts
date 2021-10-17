import { Mutations } from 'vuex-smart-module';
import { RootState } from './state';

export class RootMutations extends Mutations<RootState> {
  setIsLoading(payload: boolean): void {
    this.state.isLoading = payload;
  }
}
