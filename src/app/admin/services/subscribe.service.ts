import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Subscribe } from '../models/subscribe';

@Injectable({
    providedIn: 'root',
})
export class SubscribeService {
    private apiUrl = `${environment.apiUrl}/api/subscribe`;

    constructor(private http: HttpClient) {}

    getAllSubscribes(): Observable<Subscribe[]> {
        return this.http.get<Subscribe[]>(this.apiUrl);
    }

    getSubscribe(id: number): Observable<Subscribe> {
        return this.http.get<Subscribe>(`${this.apiUrl}/${id}`);
    }

    createSubscribe(subscribe: Subscribe): Observable<Subscribe> {
        return this.http.post<Subscribe>(this.apiUrl, subscribe);
    }

    updateSubscribe(id: number, subscribe: Subscribe): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, subscribe);
    }

    deleteSubscribe(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
