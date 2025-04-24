import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../models/trainer';

@Injectable({
    providedIn: 'root',
})
export class InstructorService {
    private baseUrl = 'http://localhost:44449/api/Instructor';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Instructor[]> {
        return this.http.get<Instructor[]>(`${this.baseUrl}/GetAll`);
    }

    getById(id: string): Observable<Instructor> {
        return this.http.get<Instructor>(`${this.baseUrl}/GetById${id}`);
    }
    create(instructor: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/Create`, instructor);
    }

    update(instructor: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/Update`, instructor);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/Delete${id}`);
    }
}
