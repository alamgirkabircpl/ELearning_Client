import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { Role } from '../models/role';
import { RoleService } from '../services/roles.service';

@Component({
    selector: 'app-role',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
    allRoles: Role[] = [];
    displayedRoles: Role[] = [];
    searchText = '';
    currentPage = 1;
    pageSize = 2;
    totalItems = 0;

    roleName = '';
    isEditing = false;
    currentRole: Role | null = null;
    loading = false;

    toastNotification = inject(ToastNotificationService);

    constructor(private roleService: RoleService) {}

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.loading = true;
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.allRoles = roles;
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading roles:', err);
                this.loading = false;
            },
        });
    }

    applyFilters(): void {
        let filteredRoles = this.allRoles;

        if (this.searchText.trim()) {
            const lowerSearch = this.searchText.trim().toLowerCase();
            filteredRoles = filteredRoles.filter((role) =>
                role.roleName.toLowerCase().includes(lowerSearch)
            );
        }

        this.totalItems = filteredRoles.length;
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedRoles = filteredRoles.slice(startIndex, endIndex);
    }

    onSearchChange(): void {
        this.currentPage = 1;
        this.applyFilters();
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
        this.applyFilters();
    }

    onSubmit(): void {
        if (!this.roleName.trim()) return;

        if (this.isEditing && this.currentRole) {
            const updatedRole: Role = {
                roleId: this.currentRole.roleId,
                roleName: this.roleName,
            };
            this.roleService.updateRole(updatedRole).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role updated successfully!'
                    );
                    this.loadRoles();
                    this.resetForm();
                },
                error: (err) => {
                    console.error('Error updating role:', err);
                    this.toastNotification.showError(
                        'Error updating role: ' + err.error.message
                    );
                },
            });
        } else {
            this.roleService.createRole(this.roleName).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role created successfully!'
                    );
                    this.loadRoles();
                    this.resetForm();
                },
                error: (err) => {
                    console.error('Error creating role:', err);
                    this.toastNotification.showError(
                        'Error creating role: ' + err.error.message
                    );
                },
            });
        }
    }

    editRole(role: Role): void {
        this.isEditing = true;
        this.currentRole = role;
        this.roleName = role.roleName;
    }

    deleteRole(roleId: string): void {
        if (confirm('Are you sure you want to delete this role?')) {
            this.roleService.deleteRole(roleId).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role deleted successfully!'
                    );
                    this.loadRoles();
                },
                error: (err) => {
                    console.error('Error deleting role:', err);
                    this.toastNotification.showError(
                        'Error deleting role: ' + err.error.message
                    );
                },
            });
        }
    }

    resetForm(): void {
        this.roleName = '';
        this.isEditing = false;
        this.currentRole = null;
    }

    getDisplayRange(): { start: number; end: number } {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
        return { start, end };
    }
}
