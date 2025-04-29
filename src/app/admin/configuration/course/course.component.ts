// course.component.ts

import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    Inject,
    inject,
    OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ApiService } from '../../../api.service';
import { ToastNotificationService } from '../../../toast-notification.service';
import { Course } from '../../models/course';
import { CourseCategory } from '../../models/course-category';
import { CourseCategoryService } from '../../services/course-category.service';
import { CourseService } from '../../services/course.service';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [CommonModule, FormsModule, CKEditorModule],
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;

    courses: Course[] = [];
    categories: CourseCategory[] = [];
    model: Course = {
        uid: '',
        courseTitle: '',
        description: '',
        courseCategoryId: 0,
        startDate: this.formatDateForInput(new Date()),
        endDate: this.formatDateForInput(new Date()),
        isVisible: false,
        logo: '',
    };
    selectedFile: File | null = null;
    isEditMode = false;
    isLoading = false;
    formSubmitted = false;
    public Editor: any;
    public config: any;
    public initialData = '<p>Write description here...</p>';

    // Pagination
    pageNumber = 1;
    pageSize = 2;
    totalItems = 0;

    private courseService = inject(CourseService);
    private categoryService = inject(CourseCategoryService);
    private toastService = inject(ToastNotificationService);
    private router = inject(Router);
    apiService = inject(ApiService);
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
        this.loadCourses();
        this.loadCategories();
        this.getImageUrl('assets/default-image.png');
    }

    loadCourses(): void {
        this.isLoading = true;
        this.courseService.getAll(this.pageNumber, this.pageSize).subscribe({
            next: (res) => {
                this.courses = res.data;
                this.totalItems = res.data.length;
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.showError('Failed to load courses');
                console.error('Error loading courses:', err);
                this.isLoading = false;
            },
        });
    }

    loadCategories(): void {
        this.categoryService.getAll().subscribe({
            next: (res) => {
                this.categories = res.data;
            },
            error: (err) => {
                this.toastService.showError('Failed to load categories');
                console.error('Error loading categories:', err);
            },
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            console.log('File selected:', this.selectedFile.name);
        }
    }

    saveCourse(form: NgForm): void {
        this.formSubmitted = true;
        if (!this.isEditMode) {
            if (form.invalid) {
                this.toastService.showError('Please fill all required fields');
                return;
            }

            if (
                !this.model.courseCategoryId ||
                this.model.courseCategoryId === 0
            ) {
                this.toastService.showError('Please select a category');
                return;
            }

            const formData = new FormData();
            formData.append('CourseTitle', this.model.courseTitle);
            formData.append('Description', this.model.description);
            formData.append(
                'CourseCategoryId',
                this.model.courseCategoryId.toString()
            );
            formData.append(
                'StartDate',
                new Date(this.model.startDate).toISOString()
            );
            formData.append(
                'EndDate',
                new Date(this.model.endDate).toISOString()
            );
            formData.append('IsVisible', this.model.isVisible.toString());

            if (this.selectedFile) {
                formData.append(
                    'File',
                    this.selectedFile,
                    this.selectedFile.name
                );
                formData.append('Logopath', this.selectedFile.name); // ✅ Important for validation
            } else {
                formData.append('Logopath', ''); // Send empty string if no file to avoid backend error
            }

            this.isLoading = true;
            const operation = this.isEditMode ? 'update' : 'create';
            const observable = this.courseService.create(formData);

            observable.subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        `Course ${operation}d successfully`
                    );
                    this.loadCourses();
                    this.resetForm();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastService.showError(
                        `Failed to ${operation} course`
                    );
                    console.error(`Error ${operation}ing course:`, err);
                    this.isLoading = false;
                },
            });
        } else {
            if (form.invalid) {
                this.toastService.showError('Please fill all required fields');
                return;
            }

            if (
                !this.model.courseCategoryId ||
                this.model.courseCategoryId === 0
            ) {
                this.toastService.showError('Please select a category');
                return;
            }

            const formData = new FormData();
            formData.append('Id', this.model.uid || '');
            formData.append('CourseId', (this.model.courseId ?? '').toString());
            formData.append('CourseTitle', this.model.courseTitle);
            formData.append('Description', this.model.description);
            formData.append(
                'CourseCategoryId',
                this.model.courseCategoryId.toString()
            );
            formData.append(
                'StartDate',
                new Date(this.model.startDate).toISOString()
            );
            formData.append(
                'EndDate',
                new Date(this.model.endDate).toISOString()
            );
            formData.append('IsVisible', this.model.isVisible.toString());
            formData.append('Logo', this.model.logo || '');

            if (this.selectedFile) {
                formData.append(
                    'File',
                    this.selectedFile,
                    this.selectedFile.name
                );
            }

            this.isLoading = true;
            this.courseService.update(formData).subscribe({
                next: (event) => {
                    this.toastService.showSuccess(
                        'Course updated successfully'
                    );
                    this.loadCourses();
                    this.resetForm();

                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastService.showError('Failed to update course');
                    console.error('Error updating course:', err);
                    this.isLoading = false;
                },
            });
        }
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(
            (cat) => cat.courseCategoryId === categoryId
        );
        return category ? category.title : 'Unknown';
    }

    editCourse(course: Course): void {
        this.model = {
            ...course,
            startDate: this.formatDateForInput(course.startDate),
            endDate: this.formatDateForInput(course.endDate),
        };
        this.isEditMode = true;
        this.selectedFile = null;
        this.formSubmitted = false;

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    deleteCourse(id: string): void {
        if (!id) return;

        if (confirm('Are you sure you want to delete this course?')) {
            this.isLoading = true;
            this.courseService.delete(id).subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Course deleted successfully'
                    );
                    this.loadCourses();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.toastService.showError('Failed to delete course');
                    console.error('Error deleting course:', err);
                    this.isLoading = false;
                },
            });
        }
    }

    resetForm(): void {
        this.model = {
            uid: '',
            courseTitle: '',
            description: '',
            courseCategoryId: 0,
            startDate: this.formatDateForInput(new Date()),
            endDate: this.formatDateForInput(new Date()),
            isVisible: false,
            logo: '',
        };
        this.selectedFile = null;
        this.isEditMode = false;
        this.formSubmitted = false;

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    onPageChange(page: number): void {
        if (
            page < 1 ||
            (page > this.pageNumber && this.courses.length < this.pageSize)
        ) {
            return;
        }
        this.pageNumber = page;
        this.loadCourses();
    }

    private formatDateForInput(date: string | Date): string {
        const d = new Date(date);
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    getImageUrl(path: string | null): string {
        return this.apiService.getImageUrl(path);
    }
}
