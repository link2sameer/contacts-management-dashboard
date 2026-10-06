import { ActionReducerMap } from '@ngrx/store';
import { ContactsState, contactsReducer } from './contacts.reducer';
import { StateDebugState, stateDebugReducer } from './state-debug.reducer';

export interface AppState {
  contacts: ContactsState;
  stateDebug: StateDebugState;
}

export const appReducers: ActionReducerMap<AppState> = {
  contacts: contactsReducer,
  stateDebug: stateDebugReducer
};
