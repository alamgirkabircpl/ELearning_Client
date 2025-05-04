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

    constructor(private http: HttpClient) {}

    getUsers(): Observable<ManageUser[]> {
        return this.http.get<ManageUser[]>(
            `${this.apiService.getFullUrl('api/ApplicationUser')}`
        );
    }

    getRoles(): Observable<ManageRole[]> {
        return this.http.get<ManageRole[]>(
            `${this.apiService.getFullUrl('api/ApplicationRole/GetAll')}`
        );
    }

    getUserRoles(
        userId: string
    ): Observable<{ data: { roles: ManageRole[] } }> {
        return this.http.get<{ data: { roles: ManageRole[] } }>(
            `${this.apiService.getFullUrl(
                'api/ApplicationUser/GetUserRolesById'
            )}${userId}`
        );
    }

    assignRole(payload: ManageUserRolePayload): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl(
                'api/ApplicationRole/assign-to-user'
            )}`,
            payload
        );
    }

    removeRole(payload: ManageUserRolePayload): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl(
                'api/ApplicationRole/remove-from-user'
            )}`,
            payload
        );
    }
}
