import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Role } from '../models/role';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(
            `${this.apiService.getFullUrl('api/ApplicationRole/GetAll')}`
        );
    }

    createRole(roleName: string): Observable<Role> {
        return this.http.post<Role>(
            `${this.apiService.getFullUrl(
                'api/ApplicationRole/Create?roleName='
            )}${encodeURIComponent(roleName)}`,
            {}
        );
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<Role>(
            `${this.apiService.getFullUrl('api/ApplicationRole/Update')}`,
            role
        );
    }

    deleteRole(roleId: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiService.getFullUrl('api/ApplicationRole/Delete')}`,
            {
                params: { roleId },
            }
        );
    }
}
