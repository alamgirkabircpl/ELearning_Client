import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { UserRoleService } from '../services/user-role.service';

export interface ManageUser {
    id: string;
    name: string;
    email: string;
}

export interface ManageRole {
    roleId: string;
    roleName: string;
    selected?: boolean;
}

export interface AssignedRoleResponse {
    id: string;
    roleName: string;
    isAssigned: boolean;
}

export interface ManageUserRolePayload {
    userId: string;
    roleId: string;
}

@Component({
    selector: 'app-manage-role',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-role.component.html',
    styleUrl: './manage-role.component.scss',
})
export class ManageRoleComponent {
    users: ManageUser[] = [];
    allRoles: ManageRole[] = [];
    selectedUser: ManageUser | null = null;
    isLoading = false;

    constructor(
        private userRoleService: UserRoleService,
        private toast: ToastNotificationService
    ) {}

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.userRoleService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.isLoading = false;
            },
            error: () => {
                this.toast.showError('Failed to load users');
                this.isLoading = false;
            },
        });
    }

    loadRoles(): void {
        this.isLoading = true;
        this.userRoleService.getRoles().subscribe({
            next: (roles) => {
                this.allRoles = roles.map((r) => ({ ...r, selected: false }));
                this.isLoading = false;
            },
            error: () => {
                this.toast.showError('Failed to load roles');
                this.isLoading = false;
            },
        });
    }

    onUserSelect(user: ManageUser | null): void {
        if (!user) return;
        this.selectedUser = user;
        this.loadUserRoles();
    }

    loadUserRoles(): void {
        if (!this.selectedUser) return;

        this.isLoading = true;

        this.userRoleService.getUserRoles(this.selectedUser.id).subscribe({
            next: (res) => {
                const assignedRoles: AssignedRoleResponse[] = (
                    res.data.roles || []
                ).map((role: any) => ({
                    id: role.id,
                    roleName: role.roleName,
                    isAssigned: role.isAssigned,
                }));

                this.allRoles = this.allRoles.map((role) => {
                    const match = assignedRoles.find(
                        (r) => r.id === role.roleId
                    );
                    console.log({ match, assignedRoles, role });

                    return {
                        ...role,
                        selected: match?.isAssigned ?? false,
                    };
                });

                this.isLoading = false;
            },
            error: () => {
                this.toast.showError('Failed to load user roles');
                this.isLoading = false;
            },
        });
    }

    onRoleChange(role: ManageRole): void {
        if (!this.selectedUser) return;

        const payload: ManageUserRolePayload = {
            userId: this.selectedUser.id,
            roleId: role.roleId,
        };

        this.isLoading = true;

        const action$ = role.selected
            ? this.userRoleService.assignRole(payload)
            : this.userRoleService.removeRole(payload);

        action$.subscribe({
            next: () => {
                this.toast.showSuccess(
                    `Role ${
                        role.selected ? 'assigned' : 'removed'
                    } successfully`
                );
                this.isLoading = false;
            },
            error: () => {
                this.toast.showError(
                    `Failed to ${role.selected ? 'assign' : 'remove'} role`
                );
                role.selected = !role.selected; // Revert on error
                this.isLoading = false;
            },
        });
    }
}
