import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);

  contacts: Contact[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching contacts', err);
        this.loading = false;
      }
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/contacts', id]);
  }
}
