import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastNotificationService } from '../../toast-notification.service';
import { ApplicationModule } from '../models/app-module';
import { AppModuleService } from '../services/app-module.service';

@Component({
    selector: 'application-module',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './application-module.component.html',
    styleUrls: ['./application-module.component.scss'],
})
export class ApplicationModuleComponent implements OnInit {
    modules: ApplicationModule[] = [];
    filteredModules: ApplicationModule[] = [];
    currentPage = 1;
    pageSize = 5;
    moduleName = '';
    isEditing = false;
    currentModule: ApplicationModule | null = null;
    loading = false;
    showForm = false;
    searchTerm = '';

    toastNotification = inject(ToastNotificationService);

    constructor(private moduleService: AppModuleService) {}

    ngOnInit(): void {
        this.loadModules();
    }

    loadModules(): void {
        this.loading = true;
        this.moduleService
            .getAllModules(this.currentPage, this.pageSize)
            .subscribe({
                next: (response) => {
                    this.modules = response.data;
                    this.filteredModules = [...this.modules];
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading modules:', err);
                    this.loading = false;
                },
            });
    }

    searchModules(): void {
        if (!this.searchTerm.trim()) {
            this.filteredModules = [...this.modules];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredModules = this.modules.filter(
                (m) =>
                    m.name.toLowerCase().includes(term) ||
                    m.moduleId.toString().toLowerCase().includes(term)
            );
        }
        this.currentPage = 1;
    }

    paginatedModules(): ApplicationModule[] {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredModules.slice(start, end);
    }

    getDisplayRange() {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(
            this.currentPage * this.pageSize,
            this.filteredModules.length
        );
        return { start, end };
    }

    getPageNumbers(): number[] {
        const pages = [];
        for (let i = 1; i <= this.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    }

    totalPages(): number {
        return Math.ceil(this.filteredModules.length / this.pageSize);
    }

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage = page;
        }
    }

    openAddModule(): void {
        this.resetForm();
        this.showForm = true;
    }

    cancelForm(): void {
        this.resetForm();
        this.showForm = false;
    }

    onSubmit(): void {
        if (!this.moduleName.trim()) return;

        if (this.isEditing && this.currentModule) {
            const updatedModule: ApplicationModule = {
                ...this.currentModule,
                name: this.moduleName,
            };
            this.moduleService.updateModule(updatedModule).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Module updated successfully!'
                    );
                    this.loadModules();
                    this.cancelForm();
                },
                error: (err) => {
                    console.error('Error updating module:', err);
                    this.toastNotification.showError(
                        'Error updating module: ' + err.error.message
                    );
                },
            });
        } else {
            this.moduleService.createModule(this.moduleName).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Module created successfully!'
                    );
                    this.loadModules();
                    this.cancelForm();
                },
                error: (err) => {
                    console.error('Error creating module:', err);
                    this.toastNotification.showError(
                        'Error creating module: ' + err.error.message
                    );
                },
            });
        }
    }

    editModule(module: ApplicationModule): void {
        this.isEditing = true;
        this.currentModule = module;
        this.moduleName = module.name;
        this.showForm = true;
    }

    deleteModule(uid: string): void {
        if (confirm('Are you sure you want to delete this module?')) {
            this.moduleService.deleteModule(uid).subscribe({
                next: () => {
                    this.toastNotification.showSuccess(
                        'Module deleted successfully!'
                    );
                    this.loadModules();
                },
                error: (err) => {
                    console.error('Error deleting module:', err);
                    this.toastNotification.showError(
                        'Error deleting module: ' + err.error.message
                    );
                },
            });
        }
    }

    resetForm(): void {
        this.moduleName = '';
        this.isEditing = false;
        this.currentModule = null;
    }
}
