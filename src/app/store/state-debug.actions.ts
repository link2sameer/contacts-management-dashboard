import { createAction } from '@ngrx/store';

// Action: describes an event that happened; reducers decide how state responds.
export const incrementDebugCounter = createAction('[State Debug] Increment');
export const decrementDebugCounter = createAction('[State Debug] Decrement');
export const resetDebugCounter = createAction('[State Debug] Reset');