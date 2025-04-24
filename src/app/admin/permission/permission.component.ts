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
    permissions: Permission[] = [];
    currentPage = 1;
    pageSize = 5;
    totalItems = 0;
    permissionName = '';
    isEditing = false;
    currentPermission: Permission | null = null;
    loading = false;

    toastNotification = inject(ToastNotificationService);

    constructor(private permissionService: PermissionService) {}

    ngOnInit(): void {
        this.loadPermissions();
    }

    loadPermissions(): void {
        this.loading = true;
        this.permissionService
            .getAllPermissions(this.currentPage, this.pageSize)
            .subscribe({
                next: (response) => {
                    this.permissions = response.data;
                    // Adjust this based on your actual API response structure
                    this.totalItems = response.data.length * 3; // Temporary multiplier
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading permissions:', err);
                    this.loading = false;
                },
            });
    }

    getPageNumbers(): number[] {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        const visiblePages = 5;
        let startPage: number, endPage: number;

        if (totalPages <= visiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const maxPagesBeforeCurrent = Math.floor(visiblePages / 2);
        const maxPagesAfterCurrent = Math.ceil(visiblePages / 2) - 1;

        if (this.currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = visiblePages;
        } else if (this.currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - visiblePages + 1;
            endPage = totalPages;
        } else {
            startPage = this.currentPage - maxPagesBeforeCurrent;
            endPage = this.currentPage + maxPagesAfterCurrent;
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
    }

    onPageChange(page: number): void {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        if (page < 1 || page > totalPages || page === this.currentPage) return;

        this.currentPage = page;
        this.loadPermissions();
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

    deletePermission(uid: string): void {
        if (confirm('Are you sure you want to delete this permission?')) {
            this.permissionService.deletePermission(uid).subscribe({
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

    // Add this method to your component class
    getDisplayRange(): { start: number; end: number } {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
        return { start, end };
    }
}
