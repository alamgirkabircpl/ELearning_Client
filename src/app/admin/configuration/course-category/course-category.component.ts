import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { ToastNotificationService } from '../../../toast-notification.service';
import { CourseCategory } from '../../models/course-category';
import { CourseCategoryService } from '../../services/course-category.service';
@Component({
    selector: 'app-course-category',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTablesModule],
    templateUrl: './course-category.component.html',
    styleUrls: ['./course-category.component.scss'],
})
export class CourseCategoryComponent implements OnInit {
    categories: CourseCategory[] = [];
    model: CourseCategory = { title: '', description: '' };
    isEditMode = false;
    formSubmitted = false;
    isLoading = false;

    dtOptions: Config = {};

    private toastService = inject(ToastNotificationService);
    private categoryService = inject(CourseCategoryService);

    ngOnInit(): void {
        console.log('Initializing CourseCategoryComponent');
        this.loadCategories();
        this.dtOptions = {
            pagingType: 'full_numbers',
        };
    }

    loadCategories(): void {
        this.isLoading = true;
        this.categoryService.getAll().subscribe({
            next: (res) => {
                this.categories = res.data;

                this.isLoading = false;
                console.log('Categories loaded:', this.categories);
            },
            error: (err) => {
                this.toastService.showError('Failed to load categories');
                console.error('Error loading categories:', err);
                this.isLoading = false;
            },
        });
    }

    saveCategory(form: NgForm): void {
        this.formSubmitted = true;
        console.log('Form submission data:', {
            formValid: form.valid,
            formValue: form.value,
            model: this.model,
            isEditMode: this.isEditMode,
        });

        if (form.invalid) {
            this.toastService.showError(
                'Please fill all required fields correctly'
            );
            return;
        }

        this.isLoading = true;
        const operation = this.isEditMode ? 'update' : 'create';
        console.log(`Attempting to ${operation} category`);

        const observable = this.isEditMode
            ? this.categoryService.update(this.model)
            : this.categoryService.create(this.model);

        observable.subscribe({
            next: () => {
                console.log(`${operation} successful`);
                this.toastService.showSuccess(
                    `Category ${operation}d successfully`
                );
                this.loadCategories();
                this.resetForm();
                this.isLoading = false;
            },
            error: (err) => {
                console.error(`${operation} failed:`, err);
                this.toastService.showError(`Failed to ${operation} category`);
                this.isLoading = false;
            },
        });
    }

    editCategory(category: CourseCategory): void {
        console.log('Editing category:', category);
        this.model = { ...category };
        this.isEditMode = true;
        this.formSubmitted = false;
    }

    deleteCategory(category: CourseCategory): void {
        if (!category.uid) {
            console.error('Cannot delete - category UID missing');
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        console.log('Deleting category:', category);
        this.isLoading = true;

        this.categoryService.delete(category.uid).subscribe({
            next: () => {
                console.log('Delete successful');
                this.toastService.showSuccess('Category deleted successfully');
                this.loadCategories();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Delete failed:', err);
                this.toastService.showError('Failed to delete category');
                this.isLoading = false;
            },
        });
    }

    resetForm(): void {
        console.log('Resetting form');
        this.model = { title: '', description: '' };
        this.isEditMode = false;
        this.formSubmitted = false;
    }
}
