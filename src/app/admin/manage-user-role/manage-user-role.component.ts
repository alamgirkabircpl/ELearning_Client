import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastNotificationService } from '../../toast-notification.service';
import {
    AssignedRoleResponse,
    ManageRole,
    ManageUser,
    ManageUserRolePayload,
} from '../manage-role/manage-role.component';
import { UserRoleService } from '../services/user-role.service';

@Component({
    selector: 'app-manage-user-role',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-user-role.component.html',
    styleUrl: './manage-user-role.component.scss',
})
export class ManageUserRoleComponent {
    users: ManageUser[] = [];
    allRoles: ManageRole[] = [];
    selectedUser: ManageUser | null = null;
    isLoading = false;

    constructor(
        private userRoleService: UserRoleService,
        private toast: ToastNotificationService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        const userId = this.route.snapshot.paramMap.get('id');

        if (userId) {
            this.loadUserById(userId);
            this.loadRolesForUser(userId);
        } else {
            this.toast.showError('Invalid user ID in route');
        }
    }
    loadUserById(id: string): void {
        this.userRoleService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                const foundUser = users.find((u) => u.id === id);
                if (foundUser) {
                    this.selectedUser = foundUser;
                } else {
                    this.toast.showError('User not found');
                }
            },
            error: () => {
                this.toast.showError('Failed to load users');
            },
        });
    }

    loadRolesForUser(id: string): void {
        this.userRoleService.getRoles().subscribe({
            next: (roles) => {
                this.allRoles = roles.map((r) => ({ ...r, selected: false }));
                this.userRoleService.getUserRoles(id).subscribe({
                    next: (res) => {
                        const assignedRoles = res.data.roles || [];

                        this.allRoles = this.allRoles.map((role) => {
                            const match = assignedRoles.find(
                                (r: any) => r.id === role.roleId
                            );
                            return {
                                ...role,
                                selected: !!match,
                            };
                        });
                    },
                    error: () => {
                        this.toast.showError('Failed to load assigned roles');
                    },
                });
            },
            error: () => {
                this.toast.showError('Failed to load roles');
            },
        });
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

    goBack(): void {
        this.location.back();
    }
}
