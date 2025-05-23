import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

@Injectable({
    providedIn: 'root',
})
export class RolePermissionService {
    private apiService = inject(ApiService);

    constructor(private http: HttpClient) {}

    // getPermissions(): Observable<PermissionDTO[]> {
    //     return this.http.get<PermissionDTO[]>(
    //         `${this.baseUrl}/api/Permission/GetAllPermission`
    //     );
    // }

    // getRoles(): Observable<PermissionAndModule[]> {
    //     return this.http.get<PermissionAndModule[]>(
    //         `${this.baseUrl}/api/ApplicationRole/GetAll`
    //     );
    // }

    // getPermissionAndModuleByRole(
    //     roleId: string
    // ): Observable<{ data: { permissions: PermissionAndModule[] } }> {
    //     return this.http.get<{ data: { permissions: PermissionAndModule[] } }>(
    //         `${this.baseUrl}/api/Common/GetPermissionByRole${roleId}`
    //     );
    // }

    // assignPermission(payload: ManagePermissionModulePayload): Observable<any> {
    //     return this.http.post(
    //         `${this.baseUrl}/api/Permission/assign-to-role`,
    //         payload
    //     );
    // }

    // removePermission(payload: ManagePermissionModulePayload): Observable<any> {
    //     return this.http.post(
    //         `${this.baseUrl}/api/Permission/remove-from-role`,
    //         payload
    //     );
    // }
}
