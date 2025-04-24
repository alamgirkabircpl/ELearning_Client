import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Enroll } from '../models/enroll';

@Injectable({
    providedIn: 'root',
})
export class EnrollService {
    constructor(private http: HttpClient, private apiService: ApiService) {}

    getAll(pageNumber: number = 1, pageSize: number = 5): Observable<any> {
        const params = new HttpParams()
            .set('PageNumber', pageNumber.toString())
            .set('PageSize', pageSize.toString());

        return this.http.get<any>(
            this.apiService.getFullUrl('api/Course/GetAll'),
            { params }
        );
    }

    getById(id: string): Observable<Enroll> {
        return this.http.get<Enroll>(
            `${this.apiService.getFullUrl('api/Course/GetById')}${id}`
        );
    }

    create(enroll: any): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/Enrolls/Create'),
            enroll
        );
    }

    update(course: FormData): Observable<any> {
        return this.http.put(
            this.apiService.getFullUrl('api/Course/Update'),
            course
        );
    }

    delete(id: string): Observable<any> {
        console.log(id);
        return this.http.delete(
            `${this.apiService.getFullUrl('api/Course/Delete')}${id}`
        );
    }
}
