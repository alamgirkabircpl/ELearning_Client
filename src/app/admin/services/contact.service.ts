import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Contact } from '../models/contact';

@Injectable({
    providedIn: 'root',
})
export class ContactService {
    private apiUrl = `${environment.apiUrl}/api/contact`;

    constructor(private http: HttpClient) {}

    getAllContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.apiUrl);
    }

    getContact(id: string): Observable<Contact> {
        return this.http.get<Contact>(`${this.apiUrl}/${id}`);
    }

    createContact(contact: Contact): Observable<Contact> {
        return this.http.post<Contact>(this.apiUrl, contact);
    }

    updateContact(id: string, contact: Contact): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, contact);
    }

    deleteContact(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
