import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ApiService } from '../../../api.service';
import { ToastNotificationService } from '../../../toast-notification.service';
import { AssignCourse, Course, Instructor } from '../../models/assign-course';
import { AssignCourseService } from '../../services/assign-course.service';
import { InstructorService } from '../../services/instructor.service';

@Component({
    selector: 'app-assign-course',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, CKEditorModule],
    templateUrl: './assign-course.component.html',
    styleUrls: ['./assign-course.component.scss'],
})
export class AssignCourseComponent implements OnInit {
    assignCourses: AssignCourse[] = [];
    filteredAssignCourses: AssignCourse[] = [];
    paginatedAssignCourses: AssignCourse[] = [];
    selectedInstructor: any = null;

    instructors: Instructor[] = [];
    courses: Course[] = [];
    currentPage = 1;
    pageSize = 2;
    totalItems = 0;
    totalPages = 0;
    searchQuery = '';

    assignCourseForm: FormGroup;
    isEditing = false;
    selectedId: number | null = null;

    selectedAssignCourseDetails = {
        courseAssignId: 11,
        courseId: 9,
        instructorDetailsId: 5,
        courseUrl: [''],
        status: null,
        price: 2.1,
        description: 'ttt',
        isApproved: false,
        isPaused: false,
        isRejected: false,
        courseName: 'PHP and Laravel',
        instructorName: 'VN-TESt kabir',

        // Adding some additional fields that would be useful
        courseDetails: {
            logo: 'images/Course/php-laravel.png',
            startDate: '2023-06-01',
            endDate: '2023-08-30',
            category: 'Web Development',
            isOnline: true,
        },
        instructorDetails: {
            profilePicture: 'images/Instructor/kabir-profile.jpg',
            qualification: 'MSc in Computer Science',
            experience: '5 years',
            linkedinProfile: 'https://linkedin.com/in/vn-test-kabir',
        },
    };

    public Editor: any;
    public config: any;
    public initialData = '<p>Write description here...</p>';

    private toastService = inject(ToastNotificationService);
    private instructorService = inject(InstructorService);
    private apiService = inject(ApiService);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private assignCourseService: AssignCourseService,
        private fb: FormBuilder
    ) {
        this.assignCourseForm = this.fb.group({
            courseId: ['', Validators.required],
            instructorDetailsId: ['', Validators.required],
            courseUrl: this.fb.array([this.fb.control('')]),
            // price: [0, [Validators.required, Validators.min(0)]],
            price: 2.1,
            description: ['', Validators.required],
            status: ['active'],
        });
    }
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
        this.loadAssignCourses();
        this.loadInstructors();
        this.loadCourses();
    }

    get courseUrls(): FormArray {
        return this.assignCourseForm.get('courseUrl') as FormArray;
    }

    get courseUrlControls(): FormControl[] {
        return this.courseUrls.controls as FormControl[];
    }

    isInvalid(field: string): boolean {
        const control = this.assignCourseForm.get(field);
        return (
            !!control && control.invalid && (control.dirty || control.touched)
        );
    }

    onInstructorChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const selectedId = target.value;

        this.selectedInstructor = this.instructors.find(
            (i) => i.instructorDetailsId === +selectedId
        );
        console.log(this.selectedInstructor);
    }

    loadAssignCourses(): void {
        this.assignCourseService.getAll().subscribe({
            next: (response: any) => {
                this.assignCourses = response.data || response;
                this.filteredAssignCourses = [...this.assignCourses];
                this.calculatePagination();
            },
            error: (err) => {
                console.error('Error loading courses', err);
                this.toastService.showError('Failed to load courses');
            },
        });
    }

    loadInstructors(): void {
        this.assignCourseService.getInstructors().subscribe({
            next: (instructors: any) =>
                (this.instructors = instructors.data || instructors),
            error: (err) => {
                console.error('Error loading instructors', err);
                this.toastService.showError('Failed to load instructors');
            },
        });
    }

    loadCourses(): void {
        this.assignCourseService.getCourses().subscribe({
            next: (courses: any) => (this.courses = courses.data || courses),
            error: (err) => {
                console.error('Error loading courses', err);
                this.toastService.showError('Failed to load courses');
            },
        });
    }

    getCourseName(courseId: number): string {
        return (
            this.courses.find((c) => c.courseId === courseId)?.courseTitle ||
            'Unknown Course'
        );
    }

    getInstructorName(instructorId: number): string {
        return (
            this.instructors.find((i) => i.instructorDetailsId === instructorId)
                ?.fullName || 'Unknown Instructor'
        );
    }

    onSubmit(): void {
        if (this.assignCourseForm.invalid) {
            this.markFormGroupTouched(this.assignCourseForm);
            return;
        }

        const formValue = this.assignCourseForm.value;
        const assignCourse: AssignCourse = {
            courseAssignId:
                this.isEditing && this.selectedId ? this.selectedId : 0,
            ...formValue,
        };

        const operation = this.isEditing
            ? this.assignCourseService.update(assignCourse)
            : this.assignCourseService.create(assignCourse);

        operation.subscribe({
            next: () => {
                this.toastService.showSuccess(
                    `Assignment ${
                        this.isEditing ? 'updated' : 'created'
                    } successfully!`
                );
                this.resetForm();
                this.loadAssignCourses();
            },
            error: (err) => {
                console.error('Error saving assignment', err);
                this.toastService.showError('Failed to save assignment');
            },
        });
    }

    editAssignCourse(assignCourse: AssignCourse): void {
        this.isEditing = true;
        this.selectedInstructor = null;
        this.selectedId = assignCourse.courseAssignId;
        this.assignCourseForm.patchValue(assignCourse);
        this.assignCourseForm.patchValue({ status: 'Active' });

        while (this.courseUrls.length) {
            this.courseUrls.removeAt(0);
        }
        if (assignCourse.courseUrl?.length) {
            assignCourse.courseUrl.forEach((url) =>
                this.courseUrls.push(this.fb.control(url))
            );
        } else {
            this.courseUrls.push(this.fb.control(''));
        }
    }

    deleteAssignCourse(id: number): void {
        if (confirm('Are you sure you want to delete this assignment?')) {
            this.assignCourseService.delete(id).subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Assignment deleted successfully!'
                    );
                    this.loadAssignCourses();
                },
                error: (err) => {
                    console.error('Error deleting assignment', err);
                    this.toastService.showError('Failed to delete assignment');
                },
            });
        }
    }

    resetForm(): void {
        this.selectedInstructor = null;

        this.assignCourseForm.reset({
            courseId: '',
            instructorDetailsId: '',
            price: 0,
            description: '',
            status: 'active',
        });
        while (this.courseUrls.length) {
            this.courseUrls.removeAt(0);
        }
        this.courseUrls.push(this.fb.control(''));

        this.isEditing = false;
        this.selectedId = null;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.calculatePagination();
    }

    calculatePagination(): void {
        this.totalItems = this.filteredAssignCourses.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedAssignCourses = this.filteredAssignCourses.slice(
            start,
            end
        );
    }

    onSearch(): void {
        const query = this.searchQuery.trim().toLowerCase();
        this.filteredAssignCourses = this.assignCourses.filter((course) =>
            (
                this.getCourseName(course.courseId) +
                this.getInstructorName(course.instructorDetailsId)
            )
                .toLowerCase()
                .includes(query)
        );
        this.currentPage = 1;
        this.calculatePagination();
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.filteredAssignCourses = [...this.assignCourses];
        this.calculatePagination();
    }

    addUrl(): void {
        this.courseUrls.push(this.fb.control(''));
    }

    removeUrl(index: number): void {
        if (this.courseUrls.length > 1) {
            this.courseUrls.removeAt(index);
        } else {
            this.courseUrls.at(index).setValue('');
        }
    }

    private markFormGroupTouched(formGroup: FormGroup | FormArray) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }

    details(data: any) {
        // Find instructor details
        const instructor = this.instructors.find(
            (f) => f.instructorDetailsId == data.instructorDetailsId
        );
        const course = this.courses.find((f) => f.courseId == data.courseId);

        console.log({ data, instructor, course });
        // Combine all data into selectedAssignCourseDetails
        this.selectedAssignCourseDetails = {
            ...data, // Spread the original assignment data
            courseDetails: {
                courseId: data.courseId,
                courseName: course?.courseTitle,
                description: data.description,
                price: course?.coursePrice,
                logo: course?.logo,
                // Add other course details you might have
            },
            instructorDetails: {
                instructorDetailsId: data.instructorDetailsId,
                instructorName: data.instructorName,
                ...instructor, // Spread all found instructor details
            },
        };

        // Open modal (Bootstrap 5)
        const modalElement = document.getElementById(
            'assignCourseDetailsModal'
        );
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.show();
        }
    }
    getImageUrl(path: string | null): string {
        return this.apiService.getImageUrl(path);
    }
}
