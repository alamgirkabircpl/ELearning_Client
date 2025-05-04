import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { PaginatedPermissions, Permission } from '../models/permission';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAllPermissions(
        pageNumber: number = 0,
        pageSize: number = 0
    ): Observable<PaginatedPermissions> {
        return this.http.get<PaginatedPermissions>(
            `${this.apiService.getFullUrl('api/Permission/GetAllPermission')}`,
            {
                params: new HttpParams()
                    .set('PageNumber', pageNumber.toString())
                    .set('PageSize', pageSize.toString()),
            }
        );
    }

    createPermission(name: string): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl('api/Permission/CreatePermission')}`,
            { name }
        );
    }

    updatePermission(permission: Permission): Observable<any> {
        return this.http.put(
            `${this.apiService.getFullUrl('api/Permission/Update')}`,
            permission
        );
    }

    deletePermission(uid: string): Observable<any> {
        return this.http.delete(
            `${this.apiService.getFullUrl('api/Permission/Delete')}${uid}`
        );
    }
}
