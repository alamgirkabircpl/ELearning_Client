import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Instructor } from '../models/trainer';

@Injectable({
    providedIn: 'root',
})
export class InstructorService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAll(): Observable<Instructor[]> {
        return this.http.get<Instructor[]>(
            `${this.apiService.getFullUrl('api/Instructor/GetAll')}`
        );
    }

    getById(id: string): Observable<Instructor> {
        return this.http.get<Instructor>(
            `${this.apiService.getFullUrl('api/Instructor/GetById')}${id}`
        );
    }
    create(instructor: FormData): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl('api/Instructor/Create')}`,
            instructor
        );
    }

    update(instructor: FormData): Observable<any> {
        return this.http.put(
            `${this.apiService.getFullUrl('api/Instructor/Update')}`,
            instructor
        );
    }

    delete(id: string): Observable<any> {
        return this.http.delete(
            `${this.apiService.getFullUrl('api/Instructor/Delete')}${id}`
        );
    }
}
