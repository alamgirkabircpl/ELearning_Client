import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { ApplicationModule, PaginatedModules } from '../models/app-module';

@Injectable({
    providedIn: 'root',
})
export class AppModuleService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAllModules(
        pageNumber: number = 0,
        pageSize: number = 0
    ): Observable<PaginatedModules> {
        return this.http.get<PaginatedModules>(
            `${this.apiService.getFullUrl('api/ApplicationModule/GetAll')}`,
            {
                params: new HttpParams()
                    .set('PageNumber', pageNumber.toString())
                    .set('PageSize', pageSize.toString()),
            }
        );
    }

    createModule(name: string): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl('api/ApplicationModule')}`,
            { name }
        );
    }

    updateModule(module: ApplicationModule): Observable<any> {
        return this.http.put(
            `${this.apiService.getFullUrl('api/ApplicationModule/Update')}`,
            module
        );
    }

    deleteModule(uid: string): Observable<any> {
        return this.http.delete(
            `${this.apiService.getFullUrl(
                'api/ApplicationModule/Delete'
            )}${uid}`
        );
    }
}
