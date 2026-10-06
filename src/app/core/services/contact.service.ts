import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, EmailAddress } from '../models/contact.model';

@Injectable()
export class ContactService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/contacts';

  getContacts(search?: string): Observable<Contact[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Contact[]>(this.baseUrl, { params });
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  getContactEmails(id: string): Observable<EmailAddress[]> {
    return this.http.get<EmailAddress[]>(`${this.baseUrl}/${id}/email_addresses`);
  }

  deleteContact(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createContact(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  updateContact(id: string, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, contact);
  }
}
