import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './index';
import { StateDebugState } from './state-debug.reducer';

// Selector: reads a focused value from the store and keeps components decoupled from state shape.
const selectStateDebug = createFeatureSelector<AppState, StateDebugState>('stateDebug');

export const selectDebugCounter = createSelector(
  selectStateDebug,
  (state) => state.counter
);