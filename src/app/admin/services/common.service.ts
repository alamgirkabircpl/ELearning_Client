import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor(private http: HttpClient) {}
    private apiService = inject(ApiService);

    GetCourseAndInstructorDetails(): Observable<any> {
        return this.http.get<any>(
            `${this.apiService.getFullUrl(
                'api/Common/GetCourseAndInstructorDetails'
            )}`
        );
    }
    GetUserByEmail(email: string): Observable<any> {
        return this.http.get<any>(
            `${this.apiService.getFullUrl(
                'api/Common/GetUserByEmail?email='
            )}${email}`
        );
    }
    GetCoursePrice(courseId: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiService.getFullUrl(
                'api/Common/GetCoursePriceByCourseId'
            )}${courseId}`
        );
    }

    GetEnrollDetailsByEnrollId(enrollId: number): Observable<any> {
        return this.http.get<any>(
            `${this.apiService.getFullUrl(
                'api/Common/GetEnrolmentDetailsByEnrollId/'
            )}${enrollId}`
        );
    }
    GetEnrolmentDetailsByUserId(userId: string): Observable<any> {
        return this.http.get<any>(
            `${this.apiService.getFullUrl(
                'api/Common/GetEnrolmentDetailsByUserId'
            )}${userId}`
        );
    }
}
