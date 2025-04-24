// user-role.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import {
    ManageRole,
    ManageUser,
    ManageUserRolePayload,
} from '../manage-role/manage-role.component';

@Injectable({
    providedIn: 'root',
})
export class UserRoleService {
    private apiService = inject(ApiService);

    private baseUrl = 'http://localhost:44449';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<ManageUser[]> {
        return this.http.get<ManageUser[]>(
            `${this.baseUrl}/api/ApplicationUser`
        );
    }

    getRoles(): Observable<ManageRole[]> {
        return this.http.get<ManageRole[]>(
            `${this.baseUrl}/api/ApplicationRole/GetAll`
        );
    }

    getUserRoles(
        userId: string
    ): Observable<{ data: { roles: ManageRole[] } }> {
        return this.http.get<{ data: { roles: ManageRole[] } }>(
            `${this.baseUrl}/api/ApplicationUser/GetUserRolesById${userId}`
        );
    }

    assignRole(payload: ManageUserRolePayload): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/api/ApplicationRole/assign-to-user`,
            payload
        );
    }

    removeRole(payload: ManageUserRolePayload): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/api/ApplicationRole/remove-from-user`,
            payload
        );
    }
}
