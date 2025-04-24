import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';

// permission.model.ts
export interface PermissionDto {
    permissionId: string;
    name: string;
    selected: boolean;
    moduleId: number; // Added moduleId property
}

export interface PermissionModuleDto {
    moduleName: string;
    moduleId: number;
    permissions: PermissionDto[];
    expanded?: boolean;
}

export interface RoleDto {
    roleId: string;
    roleName: string;
}
@Component({
    selector: 'app-manage-permission',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-permission.component.html',
    styleUrl: './manage-permission.component.scss',
})
export class ManagePermissionComponent implements OnInit {
    roles: RoleDto[] = [];
    selectedRole: RoleDto | null = null;
    modulePermissions: PermissionModuleDto[] = [];
    isLoading = false;

    constructor(
        private http: HttpClient,
        private toast: ToastNotificationService
    ) {}

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles() {
        this.http
            .get<RoleDto[]>('http://localhost:44449/api/ApplicationRole/GetAll')
            .subscribe({
                next: (res) => (this.roles = res),
                error: () => this.toast.showError('Failed to load roles'),
            });
    }

    onRoleChange(role: RoleDto) {
        this.selectedRole = role;
        this.isLoading = true;

        this.http
            .get<PermissionModuleDto[]>(
                `http://localhost:44449/api/Common/GetPermissionModuleByRoleAsync/${role.roleId}`
            )
            .subscribe({
                next: (data) => {
                    this.modulePermissions = data.filter((m) => m.moduleName);
                    this.isLoading = false;
                },
                error: () => {
                    this.toast.showError('Failed to load permissions');
                    this.isLoading = false;
                },
            });
    }

    onPermissionChange(module: PermissionModuleDto, permission: any) {
        const payload = {
            roleId: this.selectedRole?.roleId,
            moduleId: module.moduleId, // ensure moduleId is available on each permission
            permissionIds: [Number(permission.permissionId)],
        };
        if (permission.selected) {
            const url = 'http://localhost:44449/api/Permission/assign-to-role';
            this.http.post(url, payload).subscribe({
                next: () => this.toast.showSuccess('Permission updated'),
                error: () => {
                    permission.selected = !permission.selected;
                    this.toast.showError('Update failed');
                },
            });
        } else {
            const url =
                'http://localhost:44449/api/Permission/remove-from-role';
            this.http.delete(url, { body: payload }).subscribe({
                next: () => this.toast.showSuccess('Permission updated'),
                error: () => {
                    permission.selected = !permission.selected;
                    this.toast.showError('Update failed');
                },
            });
        }
    }

    isModuleAllSelected(module: PermissionModuleDto): boolean {
        return module.permissions.every((p) => p.selected);
    }

    toggleAllPermissions(module: PermissionModuleDto, selected: boolean) {
        const changedPermissions = module.permissions.filter(
            (p) => p.selected !== selected
        );

        if (changedPermissions.length === 0) return;

        changedPermissions.forEach((p) => (p.selected = selected));

        const payload = {
            roleId: this.selectedRole?.roleId,
            moduleId: module.moduleId, // assuming all permissions in module have same moduleId
            permissionIds: changedPermissions.map((p) =>
                Number(p.permissionId)
            ),
        };

        if (selected) {
            const url = 'http://localhost:44449/api/Permission/assign-to-role';

            this.http.post(url, payload).subscribe({
                next: () =>
                    this.toast.showSuccess(
                        `${
                            selected ? 'Assigned' : 'Removed'
                        } all permissions for ${module.moduleName}`
                    ),
                error: () => {
                    changedPermissions.forEach((p) => (p.selected = !selected)); // revert
                    this.toast.showError('Batch update failed');
                },
            });
        } else {
            const url =
                'http://localhost:44449/api/Permission/remove-from-role';
            this.http.delete(url, { body: payload }).subscribe({
                next: () =>
                    this.toast.showSuccess(
                        `${
                            selected ? 'Assigned' : 'Removed'
                        } all permissions for ${module.moduleName}`
                    ),
                error: () => {
                    changedPermissions.forEach((p) => (p.selected = !selected)); // revert
                    this.toast.showError('Batch update failed');
                },
            });
        }
    }
}
