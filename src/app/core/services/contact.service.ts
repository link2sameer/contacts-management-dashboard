import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, EmailAddress } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private baseUrl = 'https://mockapi.io/api/v1/contacts';

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  getContactEmails(id: string): Observable<EmailAddress[]> {
    return this.http.get<EmailAddress[]>(`${this.baseUrl}/${id}/email_addresses`);
  }
}
