import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { Permission } from '../models/permission';
import { PermissionService } from '../services/permission.service';

@Component({
    selector: 'app-permission',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit {
    allPermissions: Permission[] = [];
    displayedPermissions: Permission[] = [];
    searchQuery: string = '';
    permissionName: string = '';
    isEditing: boolean = false;
    currentPermission: Permission | null = null;

    currentPage = 1;
    pageSize = 2;
    totalItems = 0;
    loading = false;

    toastNotification = inject(ToastNotificationService);

    constructor(private permissionService: PermissionService) {}

    ngOnInit(): void {
        this.loadPermissions();
    }

    loadPermissions(): void {
        this.loading = true;
        this.permissionService.getAllPermissions().subscribe({
            next: (permissions) => {
                this.allPermissions = permissions.data; // Assuming 'data' contains the array of permissions
                this.totalItems = permissions.data.length; // Assuming 'totalItems' contains the total count
                this.updateDisplayedPermissions();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading permissions:', err);
                this.loading = false;
            },
        });
    }

    updateDisplayedPermissions(): void {
        let filtered = this.allPermissions;
        if (this.searchQuery.trim()) {
            filtered = filtered.filter((permission) =>
                permission.name
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase())
            );
        }
        this.totalItems = filtered.length;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedPermissions = filtered.slice(startIndex, endIndex);
    }

    getPageNumbers(): number[] {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updateDisplayedPermissions();
    }

    onSearch(): void {
        this.currentPage = 1;
        this.updateDisplayedPermissions();
    }

    onSubmit(): void {
        if (!this.permissionName.trim()) return;

        if (this.isEditing && this.currentPermission) {
            const updatedPermission: Permission = {
                ...this.currentPermission,
                name: this.permissionName,
            };
            this.permissionService
                .updatePermission(updatedPermission)
                .subscribe({
                    next: () => {
                        this.toastNotification.showSuccess(
                            'Permission updated successfully!'
                        );
                        this.loadPermissions();
                        this.resetForm();
                    },
                    error: (err) => {
                        console.error('Error updating permission:', err);
                        this.toastNotification.showError(
                            'Error updating permission: ' + err.error.message
                        );
                    },
                });
        } else {
            this.permissionService
                .createPermission(this.permissionName)
                .subscribe({
                    next: () => {
                        this.toastNotification.showSuccess(
                            'Permission created successfully!'
                        );
                        this.loadPermissions();
                        this.resetForm();
                    },
                    error: (err) => {
                        console.error('Error creating permission:', err);
                        this.toastNotification.showError(
                            'Error creating permission: ' + err.error.message
                        );
                    },
                });
        }
    }

    editPermission(permission: Permission): void {
        this.isEditing = true;
        this.currentPermission = permission;
        this.permissionName = permission.name;
    }

    deletePermission(permissionId: string): void {
        console.log('Deleting permission with ID:', permissionId);
        if (confirm('Are you sure you want to delete this permission?')) {
            this.permissionService.deletePermission(permissionId).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Permission deleted successfully!'
                    );
                    this.loadPermissions();
                },
                error: (err) => {
                    console.error('Error deleting permission:', err);
                    this.toastNotification.showError(
                        'Error deleting permission: ' + err.error.message
                    );
                },
            });
        }
    }

    resetForm(): void {
        this.permissionName = '';
        this.isEditing = false;
        this.currentPermission = null;
    }
}
