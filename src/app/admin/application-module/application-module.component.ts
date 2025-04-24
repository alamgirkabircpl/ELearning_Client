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
    currentPage = 1;
    pageSize = 5;
    totalItems = 0;
    moduleName = '';
    isEditing = false;
    currentModule: ApplicationModule | null = null;
    loading = false;
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
                    this.totalItems = response.data.length * 3; // Adjust based on actual API
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading modules:', err);
                    this.loading = false;
                },
            });
    }

    getDisplayRange(): { start: number; end: number } {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
        return { start, end };
    }

    getPageNumbers(): number[] {
        const totalPages = Math.ceil(this.totalItems / this.pageSize);
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    onPageChange(page: number): void {
        if (page < 1 || page > Math.ceil(this.totalItems / this.pageSize))
            return;
        this.currentPage = page;
        this.loadModules();
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
                    this.resetForm();
                },
                error: (err: any) => {
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
                    this.resetForm();
                },
                error: (err) => {
                    console.error('Error creating module:', err);
                    this.toastNotification.showError(
                        'Error creating module: ' + err.error.message
                    );
                    this.loading = false;
                },
            });
        }
    }

    editModule(module: ApplicationModule): void {
        this.isEditing = true;
        this.currentModule = module;
        this.moduleName = module.name;
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
                error: (err: any) => {
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
