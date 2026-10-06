import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-add-edit-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-contact.component.html',
  styleUrl: './add-edit-contact.component.scss'
})
export class AddEditContactComponent implements OnChanges {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  @Input() contact: Contact | null = null;
  @Input() isOpen: boolean = false;

  @Output() saved = new EventEmitter<Contact>();
  @Output() closed = new EventEmitter<void>();

  loadingContact: boolean = false;
  saving: boolean = false;
  errorMessage: string | null = null;
  fetchedContact: Contact | null = null;

  contactForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    jobTitle: [''],
    company: [''],
    phoneNumber: [''],
    address: [''],
    status: ['Active']
  });

  get currentContact(): Contact | null {
    return this.fetchedContact || this.contact;
  }

  get isEditMode(): boolean {
    return !!(this.contact?.id || this.fetchedContact?.id);
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Update Contact' : 'Add New Contact';
  }

  get modalSubtitle(): string {
    if (this.isEditMode && this.currentContact) {
      return `Edit details for ${this.currentContact.firstName || ''} ${this.currentContact.lastName || ''}`;
    }
    return 'Enter the contact details below to create a new entry.';
  }

  get submitButtonLabel(): string {
    if (this.saving) {
      return this.isEditMode ? 'Saving...' : 'Creating...';
    }
    return this.isEditMode ? 'Save Changes' : 'Create Contact';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.errorMessage = null;
      this.saving = false;
    }
    if (this.isOpen) {
      this.initForm();
    }
  }

  private initForm(): void {
    const contactId = this.contact?.id;

    if (contactId) {
      this.loadingContact = true;
      this.fetchedContact = null;

      // Immediate optimistic patch with whatever initial contact data we have
      this.patchForm(this.contact);

      // Fetch fresh contact details by ID from the API
      this.contactService.getContact(contactId).subscribe({
        next: (data) => {
          this.fetchedContact = data;
          this.patchForm(data);
          this.loadingContact = false;
        },
        error: (err) => {
          console.error('Error fetching contact by ID:', err);
          this.loadingContact = false;
        }
      });
    } else {
      this.loadingContact = false;
      this.fetchedContact = null;
      this.contactForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        company: '',
        phoneNumber: '',
        address: '',
        status: 'Active'
      });
    }
  }

  private patchForm(contact: Contact | null): void {
    if (!contact) return;
    const c = contact as any;
    const firstName = c.firstName ?? c.first_name ?? (c.name ? c.name.split(' ')[0] : '') ?? '';
    const lastName = c.lastName ?? c.last_name ?? (c.name ? c.name.split(' ').slice(1).join(' ') : '') ?? '';
    const email = c.email ?? c.emailAddress ?? '';
    const jobTitle = c.jobTitle ?? c.job_title ?? c.role ?? '';
    const company = c.company ?? c.companyName ?? '';
    const phoneNumber = c.phoneNumber ?? c.phone ?? c.phone_number ?? '';
    const address = c.address ?? '';
    const status = c.status === 'Inactive' ? 'Inactive' : 'Active';

    this.contactForm.patchValue({
      firstName,
      lastName,
      email,
      jobTitle,
      company,
      phoneNumber,
      address,
      status
    });
  }

  close(): void {
    this.errorMessage = null;
    this.saving = false;
    this.loadingContact = false;
    this.fetchedContact = null;
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = null;

    const formValues = this.contactForm.value;
    const activeContact = this.currentContact;
    const avatarUrl = activeContact?.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(formValues.firstName.toLowerCase() || 'user')}`;

    if (this.isEditMode && activeContact) {
      const updatedContact: Contact = {
        ...activeContact,
        ...formValues,
        avatar: avatarUrl
      };

      this.contactService.updateContact(activeContact.id, updatedContact).subscribe({
        next: (res) => {
          this.saving = false;
          this.saved.emit(res || updatedContact);
          this.close();
        },
        error: (err) => {
          console.error('Error updating contact on API, applying local change:', err);
          this.saving = false;
          this.saved.emit(updatedContact);
          this.close();
        }
      });
    } else {
      const newContactPayload: Partial<Contact> = {
        ...formValues,
        avatar: avatarUrl
      };

      this.contactService.createContact(newContactPayload).subscribe({
        next: (res) => {
          this.saving = false;
          this.saved.emit(res || (newContactPayload as Contact));
          this.close();
        },
        error: (err) => {
          console.error('Error adding contact on API, applying local creation:', err);
          this.saving = false;
          const fallbackContact: Contact = {
            id: Date.now().toString(),
            ...(newContactPayload as Omit<Contact, 'id'>)
          };
          this.saved.emit(fallbackContact);
          this.close();
        }
      });
    }
  }
}
