import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { Contact, EmailAddress } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
  providers: [ContactService]
})
export class ContactDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);
  private location = inject(Location);

  contact: Contact | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.fetchContactDetails(id);
      }
    });
  }

  fetchContactDetails(id: string): void {
    this.contactService.getContact(id).subscribe({
      next: (contactData) => {
        this.contact = contactData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching contact', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
