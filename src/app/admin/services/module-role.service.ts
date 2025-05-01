import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ManageModuleDTO,
    ManageRoleDTO,
    ManageRoleModulePayload,
    ModuleRoleResponse,
} from '../manage-module-role/manage-module-role.component';
@Injectable({
    providedIn: 'root',
})
export class ModuleRoleService {
    private baseUrl =
        'https://elearning-fka2dpedhgbxh5hd.eastasia-01.azurewebsites.net/api';

    constructor(private http: HttpClient) {}

    getRoles(): Observable<ManageRoleDTO[]> {
        return this.http.get<ManageRoleDTO[]>(
            `${this.baseUrl}/ApplicationRole/GetAll`
        );
    }

    getModules(): Observable<ManageModuleDTO[]> {
        return this.http.get<ManageModuleDTO[]>(
            `${this.baseUrl}/ApplicationModule/GetAll`
        );
    }

    getModuleRoles(roleId: string): Observable<ModuleRoleResponse> {
        return this.http.get<ModuleRoleResponse>(
            `${this.baseUrl}/Common/GetModuleByRoleAsync/${roleId}`
        );
    }

    assignModuleToRole(payload: ManageRoleModulePayload): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/ApplicationModule/assign-to-role`,
            payload
        );
    }

    removeModuleFromRole(payload: ManageRoleModulePayload): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}/ApplicationModule/remove-from-role`,
            { body: payload }
        );
    }
}
