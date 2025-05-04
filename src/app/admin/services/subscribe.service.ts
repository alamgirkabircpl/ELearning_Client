import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../api.service';
import { Subscribe } from '../models/subscribe';

@Injectable({
    providedIn: 'root',
})
export class SubscribeService {
    private apiUrl = `${environment.apiUrl}/api/subscribe`;
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAllSubscribes(): Observable<Subscribe[]> {
        return this.http.get<Subscribe[]>(
            this.apiService.getFullUrl('api/subscribe')
        );
    }

    getSubscribe(id: number): Observable<Subscribe> {
        return this.http.get<Subscribe>(
            `${this.apiService.getFullUrl('api/subscribe')}/${id}`
        );
    }

    createSubscribe(subscribe: Subscribe): Observable<Subscribe> {
        return this.http.post<Subscribe>(
            this.apiService.getFullUrl('api/subscribe'),
            subscribe
        );
    }

    updateSubscribe(id: number, subscribe: Subscribe): Observable<void> {
        return this.http.put<void>(
            `${this.apiService.getFullUrl('api/subscribe')}/${id}`,
            subscribe
        );
    }

    deleteSubscribe(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiService.getFullUrl('api/subscribe')}/${id}`
        );
    }
}
