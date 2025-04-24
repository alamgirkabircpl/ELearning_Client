import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { Role } from '../models/role';
import { RoleService } from '../services/roles.service';

@Component({
    selector: 'app-role',
    imports: [FormsModule, CommonModule],
    standalone: true,
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
    allRoles: Role[] = []; // All roles from API
    displayedRoles: Role[] = []; // Roles to display on current page
    currentPage = 1;
    pageSize = 5; // Items per page
    totalItems = 0;

    // Form properties
    roleName = '';
    isEditing = false;
    currentRoleId: string | null = null;

    toastNotification = inject(ToastNotificationService);

    constructor(private roleService: RoleService) {}

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.allRoles = roles;
                this.totalItems = roles.length;
                this.updateDisplayedRoles();
            },
            error: (err) => console.error('Error loading roles:', err),
        });
    }

    updateDisplayedRoles(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedRoles = this.allRoles.slice(startIndex, endIndex);
    }

    getPageNumbers(): number[] {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        return Array(totalPages)
            .fill(0)
            .map((x, i) => i + 1);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updateDisplayedRoles();
    }

    onSubmit(): void {
        if (!this.roleName.trim()) return;

        if (this.isEditing && this.currentRoleId) {
            const role: Role = {
                roleId: this.currentRoleId,
                roleName: this.roleName,
            };
            this.roleService.updateRole(role).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role updated successfully!'
                    );
                    this.loadRoles(); // Refresh the list
                    this.resetForm();
                },
                error: (err) => {
                    console.error('Error updating role:', err);
                    this.toastNotification.showError(
                        'Error updating role: ' + err.message
                    );
                },
            });
        } else {
            this.roleService.createRole(this.roleName).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role created successfully!'
                    );
                    this.loadRoles(); // Refresh the list
                    this.resetForm();
                },
                error: (err) => console.error('Error creating role:', err),
            });
        }
    }

    editRole(role: Role): void {
        this.isEditing = true;
        this.currentRoleId = role.roleId;
        this.roleName = role.roleName;
    }

    deleteRole(roleId: string): void {
        if (confirm('Are you sure you want to delete this role?')) {
            this.roleService.deleteRole(roleId).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Role deleted successfully!'
                    );
                    this.loadRoles(); // Refresh the list
                },
                error: (err) => {
                    console.error('Error deleting role:', err);
                    this.toastNotification.showError(
                        'Error deleting role: ' + err.message
                    );
                },
            });
        }
    }

    resetForm(): void {
        this.roleName = '';
        this.isEditing = false;
        this.currentRoleId = null;
    }
}
