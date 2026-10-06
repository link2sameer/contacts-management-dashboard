import { createReducer, on } from '@ngrx/store';
import {
  decrementDebugCounter,
  incrementDebugCounter,
  resetDebugCounter
} from './state-debug.actions';

export interface StateDebugState {
  counter: number;
}

export const initialStateDebugState: StateDebugState = {
  counter: 0
};

// Reducer: handles dispatched actions and returns new state without mutating the old state.
export const stateDebugReducer = createReducer(
  initialStateDebugState,
  on(incrementDebugCounter, (state) => ({ ...state, counter: state.counter + 1 })),
  on(decrementDebugCounter, (state) => ({ ...state, counter: state.counter - 1 })),
  on(resetDebugCounter, () => initialStateDebugState)
);