import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private baseUrl = 'http://localhost:44449/api/ApplicationRole';

    constructor(private http: HttpClient) {}

    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.baseUrl}/GetAll`);
    }

    createRole(roleName: string): Observable<Role> {
        return this.http.post<Role>(
            `${this.baseUrl}/Create?roleName=${encodeURIComponent(roleName)}`,
            {}
        );
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<Role>(`${this.baseUrl}/Update`, role);
    }

    deleteRole(roleId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Delete`, {
            params: { roleId },
        });
    }
}
