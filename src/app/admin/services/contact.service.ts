import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../api.service';
import { Contact } from '../models/contact';

@Injectable({
    providedIn: 'root',
})
export class ContactService {
    private apiUrl = `${environment.apiUrl}/api/contact`;

    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAllContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(
            this.apiService.getFullUrl('api/contact')
        );
    }

    getContact(id: string): Observable<Contact> {
        return this.http.get<Contact>(
            `${this.apiService.getFullUrl('api/contact')}/${id}`
        );
    }

    createContact(contact: Contact): Observable<Contact> {
        return this.http.post<Contact>(
            this.apiService.getFullUrl('api/contact'),
            contact
        );
    }

    updateContact(id: string, contact: Contact): Observable<void> {
        return this.http.put<void>(
            `${this.apiService.getFullUrl('api/contact')}/${id}`,
            contact
        );
    }

    deleteContact(id: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiService.getFullUrl('api/contact')}/${id}`
        );
    }
}
