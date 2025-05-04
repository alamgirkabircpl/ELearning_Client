import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { AssignCourse, Course, Instructor } from '../models/assign-course';

@Injectable({
    providedIn: 'root',
})
export class AssignCourseService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAll(): Observable<AssignCourse> {
        return this.http.get<AssignCourse>(
            `${this.apiService.getFullUrl('api/AssignCourse/GetAll')}`
        );
    }

    create(assignCourse: AssignCourse): Observable<AssignCourse> {
        return this.http.post<AssignCourse>(
            `${this.apiService.getFullUrl('api/AssignCourse/Create')}`,
            assignCourse
        );
    }

    update(assignCourse: AssignCourse): Observable<AssignCourse> {
        return this.http.put<AssignCourse>(
            `${this.apiService.getFullUrl('api/AssignCourse/Update')}`,
            assignCourse
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiService.getFullUrl('api/AssignCourse/Delete')}/${id}`
        );
    }

    // Mock methods for instructors and courses - replace with actual API calls
    getInstructors(): Observable<Instructor[]> {
        // Replace with actual API call to get instructors
        return this.http.get<Instructor[]>(
            `${this.apiService.getFullUrl('api/Instructor/GetAll')}`
        );
    }

    getCourses(): Observable<Course[]> {
        // Replace with actual API call to get courses
        return this.http.get<Course[]>(
            `${this.apiService.getFullUrl(
                'api/Course/GetAll?PageNumber=0&PageSize=0'
            )}`
        );
    }
}
