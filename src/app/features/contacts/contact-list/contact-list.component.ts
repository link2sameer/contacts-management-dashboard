import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';
import { AddEditContactComponent } from '../add-edit-contact/add-edit-contact.component';
import { AppState } from '../../../store';
import { loadContacts, loadContactsFailure, loadContactsSuccess } from '../../../store/contacts.actions';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AddEditContactComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
  providers: [ContactService]
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store<AppState>);
  private searchTerms = new Subject<string>();

  searchControl = new FormControl('', { nonNullable: true });
  contacts: Contact[] = [];
  loading = false;
  errorMessage: string | null = null;

  activeMenuContactId: string | null = null;
  isAddEditModalOpen = false;
  selectedContactForEdit: Contact | null = null;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeMenuContactId = null;
  }

  ngOnInit(): void {
    console.log('State of the store on init:', this.store);
    this.store
      .select((state) => state.contacts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.contacts = state.contacts;
        this.loading = state.loading;
        this.errorMessage = state.error;
      });

    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => this.searchTerms.next(searchTerm));

    this.searchTerms
      .pipe(
        tap((searchTerm) => this.store.dispatch(loadContacts({ searchTerm }))),
        switchMap((searchTerm) =>
          this.contactService.getContacts(searchTerm).pipe(
            map((contacts) => loadContactsSuccess({ contacts })),
            catchError((error: unknown) => {
              console.error('Error loading contacts', error);
              return of(loadContactsFailure({ error: 'Failed to load contacts.' }));
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((action) => this.store.dispatch(action));
  }

  getContacts(): void {
    this.searchTerms.next(this.searchControl.value);
  }

  toggleMenu(contactId: string, event: Event): void {
    event.stopPropagation();
    this.activeMenuContactId = this.activeMenuContactId === contactId ? null : contactId;
  }

  openAddContact(): void {
    this.activeMenuContactId = null;
    this.selectedContactForEdit = null;
    this.isAddEditModalOpen = true;
  }

  openUpdateModal(contact: Contact, event: Event): void {
    event.stopPropagation();
    this.activeMenuContactId = null;
    this.selectedContactForEdit = { ...contact };
    this.isAddEditModalOpen = true;
  }

  closeAddEditModal(): void {
    this.isAddEditModalOpen = false;
    this.selectedContactForEdit = null;
  }

  onContactSaved(savedContact: Contact): void {
    this.closeAddEditModal();
    this.getContacts();
  }

  deleteContact(contact: Contact, event: Event): void {
    event.stopPropagation();
    this.activeMenuContactId = null;

    const contactName = `${contact.firstName} ${contact.lastName}`;
    if (!confirm(`Are you sure you want to delete ${contactName}?`)) {
      return;
    }

    this.contactService.deleteContact(contact.id).subscribe({
      next: () => this.getContacts(),
      error: (err) => {
        console.error('Error deleting contact', err);
        this.errorMessage = 'Failed to delete contact.';
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  viewDetails(id: string): void {
    this.router.navigate(['/contacts', id]);
  }
}
