import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ToastNotificationService } from '../../../toast-notification.service';
import { TruncatePipe } from '../../../truncate.pipe';
import { AssignCourse, Course, Instructor } from '../../models/assign-course';
import { AssignCourseService } from '../../services/assign-course.service';

@Component({
    selector: 'app-assign-course',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TruncatePipe, FormsModule],
    templateUrl: './assign-course.component.html',
    styleUrl: './assign-course.component.scss',
})
export class AssignCourseComponent implements OnInit {
    assignCourses: AssignCourse[] = [];
    instructors: Instructor[] = [];
    courses: Course[] = [];
    currentPage = 1;
    pageSize = 5;
    totalItems = 0;
    totalPages = 0;

    assignCourseForm: FormGroup;
    isEditing = false;
    selectedId: number | null = null;

    private toastService = inject(ToastNotificationService);
    constructor(
        private assignCourseService: AssignCourseService,
        private fb: FormBuilder
    ) {
        this.assignCourseForm = this.fb.group({
            courseId: ['', Validators.required],
            instructorDetailsId: ['', Validators.required],
            courseUrl: this.fb.array(['']),
            isApproved: [true],
            isRejected: [false],
            isPaused: [false],
            price: [0, [Validators.required, Validators.min(0)]],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.loadData();
        this.loadInstructors();
        this.loadCourses();
    }

    get courseUrlControls() {
        return this.assignCourseForm.get('courseUrl')?.value || [];
    }

    getCourseName(courseId: number): string {
        const course = this.courses.find((c) => c.courseId === courseId);
        return course ? course.courseTitle : 'Unknown Course';
    }

    getInstructorName(instructorId: number): string {
        const instructor = this.instructors.find(
            (i) => i.instructorDetailsId === instructorId
        );
        return instructor ? instructor.fullName : 'Unknown Instructor';
    }

    loadData(): void {
        this.assignCourseService.getAll().subscribe({
            next: (courses: any) => {
                console.log('hi', courses);
                this.assignCourseForm = courses;
            },
            error: (err) => console.error('Error loading courses', err),
        });
    }

    loadInstructors(): void {
        this.assignCourseService.getInstructors().subscribe({
            next: (instructors: any) => {
                this.instructors = instructors;
            },
            error: (err) => console.error('Error loading instructors', err),
        });
    }

    loadCourses(): void {
        this.assignCourseService.getCourses().subscribe({
            next: (courses: any) => {
                this.courses = courses.data;
            },
            error: (err) => console.error('Error loading courses', err),
        });
    }

    onSubmit(): void {
        if (this.assignCourseForm.invalid) {
            return;
        }

        const formValue = this.assignCourseForm.value;
        const assignCourse: AssignCourse = {
            courseAssignId:
                this.isEditing && this.selectedId ? this.selectedId : 0,
            ...formValue,
        };
        console.log(JSON.stringify(assignCourse));
        console.log('Form Value:', formValue);
        if (this.isEditing) {
            const operation = this.assignCourseService.update(assignCourse);

            operation.subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Assignment updated successfully!'
                    );
                    this.isEditing = false;
                    this.resetForm();
                    this.loadData();
                },
                error: (err) =>
                    console.error('Error saving assign course', err),
            });
        } else {
            const operation = this.assignCourseService.create(assignCourse);

            operation.subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Assignment created successfully!'
                    );
                    this.resetForm();
                    this.loadData();
                },
                error: (err) =>
                    console.error('Error saving assign course', err),
            });
        }
    }

    editAssignCourse(assignCourse: AssignCourse): void {
        this.isEditing = true;
        this.selectedId = assignCourse.courseAssignId;
        this.assignCourseForm.patchValue({
            courseId: assignCourse.courseId,
            instructorDetailsId: assignCourse.instructorDetailsId,
            courseUrl: assignCourse.courseUrl,

            price: assignCourse.price,
            description: assignCourse.description,
        });
    }

    deleteAssignCourse(id: number): void {
        if (confirm('Are you sure you want to delete this assignment?')) {
            this.assignCourseService.delete(id).subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Assignment deleted successfully!'
                    );
                    this.loadData();
                },
                error: (err) =>
                    console.error('Error deleting assign course', err),
            });
        }
    }

    resetForm(): void {
        this.assignCourseForm.reset();
        this.isEditing = false;
        this.selectedId = null;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadData();
    }

    addUrl(): void {
        const currentUrls = this.assignCourseForm.get('courseUrl')?.value || [];
        this.assignCourseForm
            .get('courseUrl')
            ?.patchValue([...currentUrls, '']);
    }

    removeUrl(index: number): void {
        const currentUrls = this.assignCourseForm.get('courseUrl')?.value || [];
        if (index >= 0 && index < currentUrls.length) {
            currentUrls.splice(index, 1);
            this.assignCourseForm
                .get('courseUrl')
                ?.patchValue([...currentUrls]);
        }
    }

    updateUrl(index: number, value: string): void {
        const currentUrls = this.assignCourseForm.get('courseUrl')?.value || [];
        if (index >= 0 && index < currentUrls.length) {
            currentUrls[index] = value;
            this.assignCourseForm
                .get('courseUrl')
                ?.patchValue([...currentUrls]);
        }
    }

    trackByFn(index: number): number {
        return index;
    }
}
