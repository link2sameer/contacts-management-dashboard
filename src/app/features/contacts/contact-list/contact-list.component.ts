import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';
import { AddEditContactComponent } from '../add-edit-contact/add-edit-contact.component';
import { AppState } from '../../../store';
import { loadContacts } from '../../../store/contacts.actions';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AddEditContactComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store<AppState>);

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
      .subscribe((searchTerm) => {
        this.store.dispatch(loadContacts({ searchTerm }));
      });
  }

  getContacts(): void {
    this.store.dispatch(loadContacts({ searchTerm: this.searchControl.value }));
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
      next: () => {
        this.getContacts();
        if (this.router.url.includes(`/contacts/${contact.id}`)) {
          this.router.navigate(['/contacts']);
        }
      },
      error: (err) => {
        console.error('Error deleting contact on server, applying local deletion', err);
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        if (this.router.url.includes(`/contacts/${contact.id}`)) {
          this.router.navigate(['/contacts']);
        }
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


