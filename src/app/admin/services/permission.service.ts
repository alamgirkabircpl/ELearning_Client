import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedPermissions, Permission } from '../models/permission';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private baseUrl =
        'https://elearning-fka2dpedhgbxh5hd.eastasia-01.azurewebsites.net/api/Permission';

    constructor(private http: HttpClient) {}

    getAllPermissions(
        pageNumber: number = 1,
        pageSize: number = 5
    ): Observable<PaginatedPermissions> {
        return this.http.get<PaginatedPermissions>(
            `${this.baseUrl}/GetAllPermission`,
            {
                params: new HttpParams()
                    .set('PageNumber', pageNumber.toString())
                    .set('PageSize', pageSize.toString()),
            }
        );
    }

    createPermission(name: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/CreatePermission`, { name });
    }

    updatePermission(permission: Permission): Observable<any> {
        return this.http.put(`${this.baseUrl}/Update`, permission);
    }

    deletePermission(uid: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/Delete${uid}`);
    }
}
