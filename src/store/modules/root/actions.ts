import { Actions } from 'vuex-smart-module';
import { RootMutations } from './mutations';
import { RootState } from './state';

export class RootActions extends Actions<
RootState,
never,
RootMutations,
RootActions
> {

}
