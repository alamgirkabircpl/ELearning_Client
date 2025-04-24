import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Course, PaginatedCourses } from '../models/course';
@Injectable({
    providedIn: 'root',
})
export class CourseService {
    constructor(private http: HttpClient, private apiService: ApiService) {}

    getAll(
        pageNumber: number = 1,
        pageSize: number = 5
    ): Observable<PaginatedCourses> {
        const params = new HttpParams()
            .set('PageNumber', pageNumber.toString())
            .set('PageSize', pageSize.toString());

        return this.http.get<PaginatedCourses>(
            this.apiService.getFullUrl('api/Course/GetAll'),
            { params }
        );
    }

    getById(id: string): Observable<Course> {
        return this.http.get<Course>(
            `${this.apiService.getFullUrl('api/Course/GetById')}${id}`
        );
    }

    create(course: FormData): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/Course/Create'),
            course
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
