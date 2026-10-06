import { createReducer, on } from '@ngrx/store';
import { Contact } from '../core/models/contact.model';
import { loadContacts, loadContactsFailure, loadContactsSuccess } from './contacts.actions';

export interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const initialContactsState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
  searchTerm: ''
};

export const contactsReducer = createReducer(
  initialContactsState,
  on(loadContacts, (state, { searchTerm }) => ({
    ...state,
    loading: true,
    searchTerm,
    error: null
  })),
  on(loadContactsSuccess, (state, { contacts }) => ({
    ...state,
    contacts,
    loading: false,
    error: null
  })),
  on(loadContactsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
