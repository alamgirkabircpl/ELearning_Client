import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
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
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    getRoles(): Observable<ManageRoleDTO[]> {
        return this.http.get<ManageRoleDTO[]>(
            `${this.apiService.getFullUrl('api/ApplicationRole/GetAll')}`
        );
    }

    getModules(): Observable<ManageModuleDTO[]> {
        return this.http.get<ManageModuleDTO[]>(
            `${this.apiService.getFullUrl('api/ApplicationModule/GetAll')}`
        );
    }

    getModuleRoles(roleId: string): Observable<ModuleRoleResponse> {
        return this.http.get<ModuleRoleResponse>(
            `${this.apiService.getFullUrl(
                'api/Common/GetModuleByRoleAsync'
            )}/${roleId}`
        );
    }

    assignModuleToRole(payload: ManageRoleModulePayload): Observable<any> {
        return this.http.post(
            `${this.apiService.getFullUrl(
                'api/ApplicationModule/assign-to-role'
            )}`,
            payload
        );
    }

    removeModuleFromRole(payload: ManageRoleModulePayload): Observable<any> {
        return this.http.delete(
            `${this.apiService.getFullUrl(
                'api/ApplicationModule/remove-from-role'
            )}`,
            { body: payload }
        );
    }
}
