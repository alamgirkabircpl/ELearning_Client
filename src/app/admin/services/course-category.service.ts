import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { CourseCategory } from '../models/course-category';
import { PaginatedResponse } from '../models/paginated-response';

@Injectable({
    providedIn: 'root',
})
export class CourseCategoryService {
    private apiService = inject(ApiService);
    private http = inject(HttpClient);

    getAll(): Observable<PaginatedResponse<CourseCategory>> {
        const url = this.apiService.getFullUrl(`api/CourseCategory/GetAll`);
        return this.http.get<PaginatedResponse<CourseCategory>>(url);
    }

    create(category: CourseCategory): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/CourseCategory/Create'),
            {
                title: category.title,
                description: category.description,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    update(category: CourseCategory): Observable<any> {
        if (!category.uid) {
            throw new Error('UID is required for update');
        }

        return this.http.put(
            this.apiService.getFullUrl('api/CourseCategory/Update'),
            {
                id: category.uid, // API expects 'id' field
                courseCategoryId: category.courseCategoryId || 0, // Default to 0 if not provided
                title: category.title,
                description: category.description,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    delete(uid: string): Observable<any> {
        return this.http.delete(
            `${this.apiService.getFullUrl('api/CourseCategory/Delete')}${uid}`
        );
    }
}
