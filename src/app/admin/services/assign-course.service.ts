import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssignCourse, Course, Instructor } from '../models/assign-course';

@Injectable({
    providedIn: 'root',
})
export class AssignCourseService {
    private baseUrl =
        'https://elearning-fka2dpedhgbxh5hd.eastasia-01.azurewebsites.net/api/AssignCourse';

    constructor(private http: HttpClient) {}

    getAll(): Observable<AssignCourse> {
        return this.http.get<AssignCourse>(`${this.baseUrl}/GetAll`);
    }

    create(assignCourse: AssignCourse): Observable<AssignCourse> {
        return this.http.post<AssignCourse>(
            `${this.baseUrl}/Create`,
            assignCourse
        );
    }

    update(assignCourse: AssignCourse): Observable<AssignCourse> {
        return this.http.put<AssignCourse>(
            `${this.baseUrl}/Update`,
            assignCourse
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Delete/${id}`);
    }

    // Mock methods for instructors and courses - replace with actual API calls
    getInstructors(): Observable<Instructor[]> {
        // Replace with actual API call to get instructors
        return this.http.get<Instructor[]>(
            'https://elearning-fka2dpedhgbxh5hd.eastasia-01.azurewebsites.net/api/Instructor/GetAll'
        );
    }

    getCourses(): Observable<Course[]> {
        // Replace with actual API call to get courses
        return this.http.get<Course[]>(
            'https://elearning-fka2dpedhgbxh5hd.eastasia-01.azurewebsites.net/api/Course/GetAll?PageNumber=1&PageSize=12'
        );
    }
}
