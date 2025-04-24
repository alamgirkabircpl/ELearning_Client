import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { ModuleRoleService } from '../services/module-role.service';

export interface ManageRoleDTO {
    roleId: string;
    roleName: string;
}

export interface ManageModuleDTO {
    moduleId: number;
    name: string;
    selected?: boolean;
}

export interface AssignedModuleDTO {
    moduleId: number;
    name: string;
    isAssigned: boolean;
}

export interface ManageRoleModulePayload {
    moduleId: number;
    roleId: string;
}

export interface ModuleRoleResponse {
    data: {
        modules: AssignedModuleDTO[];
    };
}

@Component({
    selector: 'app-manage-module-role',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-module-role.component.html',
    styleUrls: ['./manage-module-role.component.scss'],
})
export class ManageModuleRoleComponent {
    roles: ManageRoleDTO[] = [];
    allModules: ManageModuleDTO[] = [];
    selectedRole: ManageRoleDTO | null = null;
    isLoading = false;
    allSelected = false;
    indeterminateSelection = false;

    constructor(
        private moduleRoleService: ModuleRoleService,
        private toast: ToastNotificationService
    ) {}

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.isLoading = true;
        this.moduleRoleService.getRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
                this.isLoading = false;
            },
            error: () => {
                this.toast.showError('Failed to load roles');
                this.isLoading = false;
            },
        });
    }

    onRoleSelect(role: ManageRoleDTO | null): void {
        if (!role) return;
        this.selectedRole = role;
        this.loadAssignedModules();
    }

    loadAssignedModules(): void {
        if (!this.selectedRole) return;

        this.isLoading = true;
        this.moduleRoleService
            .getModuleRoles(this.selectedRole.roleId)
            .subscribe({
                next: (response: ModuleRoleResponse) => {
                    this.allModules = response.data.modules.map((module) => ({
                        moduleId: module.moduleId,
                        name: module.name,
                        selected: module.isAssigned,
                    }));
                    this.updateSelectionState();
                    this.isLoading = false;
                },
                error: () => {
                    this.toast.showError('Failed to load assigned modules');
                    this.isLoading = false;
                },
            });
    }

    onModuleToggle(module: ManageModuleDTO): void {
        if (!this.selectedRole) {
            this.toast.showError('Please select a role first');
            module.selected = !module.selected;
            return;
        }

        const payload: ManageRoleModulePayload = {
            roleId: this.selectedRole.roleId,
            moduleId: module.moduleId,
        };

        this.isLoading = true;
        const action$ = module.selected
            ? this.moduleRoleService.assignModuleToRole(payload)
            : this.moduleRoleService.removeModuleFromRole(payload);

        action$.subscribe({
            next: () => {
                this.toast.showSuccess(
                    `Module ${module.name} ${
                        module.selected ? 'assigned to' : 'removed from'
                    } role successfully`
                );
                this.updateSelectionState();
                this.isLoading = false;
            },
            error: () => {
                this.toast.showError(
                    `Failed to ${module.selected ? 'assign' : 'remove'} module`
                );
                module.selected = !module.selected;
                this.updateSelectionState();
                this.isLoading = false;
            },
        });
    }

    toggleSelectAll(): void {
        if (!this.selectedRole) {
            this.toast.showError('Please select a role first');
            return;
        }

        const newSelectedState = !this.allSelected;
        this.allSelected = newSelectedState;
        this.indeterminateSelection = false;

        // Update all checkboxes
        this.allModules.forEach(
            (module) => (module.selected = newSelectedState)
        );

        // Batch update all modules
        this.batchUpdateModules(newSelectedState);
    }

    batchUpdateModules(assign: boolean): void {
        if (!this.selectedRole) return;

        this.isLoading = true;

        const payloads = this.allModules.map((module) => ({
            roleId: this.selectedRole!.roleId,
            moduleId: module.moduleId,
        }));

        let completedCount = 0;
        let failedCount = 0;

        payloads.forEach((item) => {
            const action$ = assign
                ? this.moduleRoleService.assignModuleToRole({
                      roleId: item.roleId,
                      moduleId: item.moduleId,
                  })
                : this.moduleRoleService.removeModuleFromRole({
                      roleId: item.roleId,
                      moduleId: item.moduleId,
                  });

            action$.subscribe({
                next: () => {
                    this.checkBatchCompletion(
                        ++completedCount,
                        payloads.length,
                        failedCount,
                        assign
                    );
                },
                error: () => {
                    failedCount++;
                    this.checkBatchCompletion(
                        ++completedCount,
                        payloads.length,
                        failedCount,
                        assign
                    );
                },
            });
        });
    }

    private checkBatchCompletion(
        done: number,
        total: number,
        failed: number,
        assign: boolean
    ): void {
        if (done >= total) {
            this.isLoading = false;
            this.updateSelectionState();

            if (failed === 0) {
                this.toast.showSuccess(
                    `All modules ${
                        assign ? 'assigned to' : 'removed from'
                    } role successfully`
                );
            } else if (failed < total) {
                this.toast.showError(
                    `${failed} of ${total} modules failed to ${
                        assign ? 'assign' : 'remove'
                    }`
                );
            } else {
                this.toast.showError(
                    `Failed to ${assign ? 'assign' : 'remove'} all modules`
                );
                // Rollback UI selection state
                this.allModules.forEach(
                    (module) => (module.selected = !assign)
                );
            }
        }
    }

    updateSelectionState(): void {
        if (this.allModules.length === 0) {
            this.allSelected = false;
            this.indeterminateSelection = false;
            return;
        }

        const selectedCount = this.allModules.filter((m) => m.selected).length;
        this.allSelected = selectedCount === this.allModules.length;
        this.indeterminateSelection =
            selectedCount > 0 && selectedCount < this.allModules.length;
    }
}
