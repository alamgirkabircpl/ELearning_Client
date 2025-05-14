import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Payment } from '../models/payment';

@Injectable({
    providedIn: 'root',
})
export class CoursePaymentService {
    constructor(private http: HttpClient, private apiService: ApiService) {}

    getAll(pageNumber: number = 0, pageSize: number = 0): Observable<any> {
        const params = new HttpParams()
            .set('PageNumber', pageNumber.toString())
            .set('PageSize', pageSize.toString());

        return this.http.get<any>(this.apiService.getFullUrl('api/Payments'), {
            params,
        });
    }

    getById(id: string): Observable<Payment> {
        return this.http.get<Payment>(
            `${this.apiService.getFullUrl('api/Enrolls/GetById')}${id}`
        );
    }

    create(enroll: any): Observable<any> {
        return this.http.post(
            this.apiService.getFullUrl('api/Enrolls/Create'),
            enroll
        );
    }

    update(enroll: FormData): Observable<any> {
        return this.http.put(
            this.apiService.getFullUrl('api/Enrolls/Update'),
            enroll
        );
    }

    delete(id: string): Observable<any> {
        console.log(id);
        return this.http.delete(
            `${this.apiService.getFullUrl('api/Enrolls/Delete')}${id}`
        );
    }
}
