import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationModule, PaginatedModules } from '../models/app-module';

@Injectable({
    providedIn: 'root',
})
export class AppModuleService {
    private baseUrl = 'http://localhost:44449/api/ApplicationModule';

    constructor(private http: HttpClient) {}

    getAllModules(
        pageNumber: number = 1,
        pageSize: number = 5
    ): Observable<PaginatedModules> {
        return this.http.get<PaginatedModules>(`${this.baseUrl}/GetAll`, {
            params: new HttpParams()
                .set('PageNumber', pageNumber.toString())
                .set('PageSize', pageSize.toString()),
        });
    }

    createModule(name: string): Observable<any> {
        return this.http.post(`${this.baseUrl}`, { name });
    }

    updateModule(module: ApplicationModule): Observable<any> {
        return this.http.put(`${this.baseUrl}/Update`, module);
    }

    deleteModule(uid: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/Delete${uid}`);
    }
}
