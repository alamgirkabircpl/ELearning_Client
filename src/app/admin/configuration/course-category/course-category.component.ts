import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Component,
    inject,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToastNotificationService } from '../../../toast-notification.service';
import { CourseCategory } from '../../models/course-category';
import { CourseCategoryService } from '../../services/course-category.service';

@Component({
    selector: 'app-course-category',
    standalone: true,
    templateUrl: './course-category.component.html',
    styleUrls: ['./course-category.component.scss'],
    imports: [CommonModule, FormsModule, CKEditorModule],
})
export class CourseCategoryComponent implements OnInit, OnDestroy {
    categories: CourseCategory[] = [];
    filteredCategories: CourseCategory[] = [];
    model: CourseCategory = { title: '', description: '' };
    isEditMode = false;
    formSubmitted = false;
    isLoading = false;

    searchText = '';

    public Editor: any;
    public config: any;
    public initialData = '<p>Write description here...</p>';

    // Pagination
    currentPage = 1;
    pageSize = 2;
    totalPages = 0;

    private toastService = inject(ToastNotificationService);
    private categoryService = inject(CourseCategoryService);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    async ngOnInit(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            try {
                const ClassicEditor = (
                    await import('@ckeditor/ckeditor5-build-classic')
                ).default;
                this.Editor = ClassicEditor;
                this.config = {
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'undo',
                        'redo',
                    ],
                };
            } catch (error) {
                console.error('Error loading CKEditor:', error);
            }
        }

        this.loadCategories();
    }

    loadCategories(): void {
        this.isLoading = true;
        this.categoryService.getAll().subscribe({
            next: (res) => {
                this.categories = res.data;
                this.applyFilter();
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.showError('Failed to load categories');
                this.isLoading = false;
            },
        });
    }

    applyFilter(): void {
        const search = this.searchText.toLowerCase();
        this.filteredCategories = this.categories.filter(
            (cat) =>
                cat.title.toLowerCase().includes(search) ||
                cat.description.toLowerCase().includes(search)
        );
        this.totalPages = Math.ceil(
            this.filteredCategories.length / this.pageSize
        );
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
        }
        console.log(
            'first,',
            this.totalPages,
            this.currentPage,
            this.categories
        );
    }

    saveCategory(form: NgForm): void {
        this.formSubmitted = true;

        if (form.invalid) {
            this.toastService.showError(
                'Please fill all required fields correctly'
            );
            return;
        }

        this.isLoading = true;
        const observable = this.isEditMode
            ? this.categoryService.update(this.model)
            : this.categoryService.create(this.model);

        observable.subscribe({
            next: () => {
                this.toastService.showSuccess(
                    `Course Category ${
                        this.isEditMode ? 'updated' : 'created'
                    } successfully`
                );
                this.loadCategories();
                this.resetForm();
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.showError('Failed to save category');
                this.isLoading = false;
            },
        });
    }

    editCategory(category: CourseCategory): void {
        this.model = { ...category };
        this.isEditMode = true;
        this.formSubmitted = false;
    }
    deleteCategory(category: CourseCategory): void {
        if (!category.uid) return;

        this.toastService
            .confirm(
                'Confirm Deletion',
                'Are you sure you want to delete this category?'
            )
            .then((confirmed) => {
                if (!confirmed) {
                    this.toastService.showInfo('Deletion cancelled');
                    return;
                }

                this.isLoading = true;

                this.categoryService.delete(category.uid!).subscribe({
                    next: () => {
                        this.toastService.showSuccess(
                            'Course Category deleted successfully'
                        );
                        this.loadCategories();
                        this.isLoading = false;
                    },
                    error: () => {
                        this.toastService.showError(
                            'Failed to delete course category'
                        );
                        this.isLoading = false;
                    },
                });
            });
    }

    resetForm(): void {
        this.model = { title: '', description: '' };
        this.isEditMode = false;
        this.formSubmitted = false;
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    ngOnDestroy(): void {}
}
