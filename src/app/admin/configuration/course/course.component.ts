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
    daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    courses: Course[] = [];
    filteredCourses: Course[] = [];
    categories: CourseCategory[] = [];
    model: Course = {
        uid: '',
        courseTitle: '',
        description: '',
        courseCategoryId: 0,
        startDate: this.formatDateForInput(new Date()),
        endDate: this.formatDateForInput(new Date()),
        startTime: this.formatTimeForInput(new Date()),
        endTime: this.formatTimeForInput(new Date()),
        isVisible: false,
        isFreeCourse: false,
        isOnLine: false,
        internal: false,
        coursePrice: 0,
        discount: 0,
        selectedDays: [],
        logo: '',
    };
    selectedFile: File | null = null;
    isEditMode = false;
    isLoading = false;
    searchText = '';
    formSubmitted = false;
    dateTimeError = '';
    // Add this property to your component class
    readonly Math = Math;
    public Editor: any;
    public config: any;
    public initialData = '<p>Write description here...</p>';

    // Pagination
    currentPage = 1;
    pageSize = 2;
    totalPages = 0;

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
    }

    loadCourses(): void {
        this.isLoading = true;
        this.courseService.getAll().subscribe({
            next: (res) => {
                this.courses = res.data;
                this.applyFilter();
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.showError('Failed to load courses');
                console.error('Error loading courses:', err);
                this.isLoading = false;
            },
        });
    }
    onDayToggle(event: any, day: string) {
        // Ensure it's initialized
        if (!Array.isArray(this.model.selectedDays)) {
            this.model.selectedDays = [];
        }

        if (event.target.checked) {
            // Add the day if it's not already in the list
            if (!this.model.selectedDays.includes(day)) {
                this.model.selectedDays.push(day);
            }
        } else {
            // Remove the day
            this.model.selectedDays = this.model.selectedDays.filter(
                (d) => d !== day
            );
        }

        console.log(this.model.selectedDays);
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

    applyFilter(): void {
        const search = this.searchText.toLowerCase();
        this.filteredCourses = this.courses.filter(
            (course) =>
                course.courseTitle.toLowerCase().includes(search) ||
                this.getCategoryName(course.courseCategoryId)
                    .toLowerCase()
                    .includes(search) ||
                (course.description &&
                    course.description.toLowerCase().includes(search))
        );
        this.totalPages = Math.ceil(
            this.filteredCourses.length / this.pageSize
        );
        this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    onDateChange(field: 'startDate' | 'endDate', event: Event): void {
        const input = event.target as HTMLInputElement;
        this.model[field] = input.value;
        this.validateDateTime();
    }

    onTimeChange(field: 'startTime' | 'endTime', event: Event): void {
        const input = event.target as HTMLInputElement;
        this.model[field] = input.value;
        console.log(input, this.model.startTime, this.model.endTime);
        this.validateDateTime();
    }

    private validateDateTime(): void {
        this.dateTimeError = '';

        if (!this.model.startDate || !this.model.endDate) return;

        const startDateTime = this.combineDateTime(
            String(this.model.startDate),
            String(this.model.startTime)
        );
        const endDateTime = this.combineDateTime(
            String(this.model.endDate),
            String(this.model.endTime)
        );

        if (endDateTime < startDateTime) {
            this.dateTimeError = 'End date/time must be after start date/time';
        }
    }
    saveCourse(form: NgForm): void {
        this.formSubmitted = true;
        this.validateDateTime();
        if (form.invalid || this.dateTimeError) {
            if (this.dateTimeError) {
                this.toastService.showError(this.dateTimeError);
            }
            return;
        }

        if (!this.model.courseCategoryId || this.model.courseCategoryId === 0) {
            this.toastService.showError('Please select a category');
            return;
        }

        const formData = new FormData();
        // const startDateTime = this.combineDateTime(
        //     String(this.model.startDate),
        //     String(this.model.startTime)
        // );
        // const endDateTime = this.combineDateTime(
        //     String(this.model.endDate),
        //     String(this.model.endTime)
        // );

        formData.append('CourseTitle', this.model.courseTitle);
        formData.append('SelectedDays', this.model.selectedDays.join(','));
        formData.append('Description', this.model.description);
        formData.append('Discount', this.model.discount.toString());
        formData.append('CoursePrice', this.model.coursePrice.toString());
        formData.append(
            'CourseCategoryId',
            this.model.courseCategoryId.toString()
        );
        formData.append(
            'StartDate',
            this.model.startDate instanceof Date
                ? this.model.startDate.toISOString()
                : this.model.startDate
        );
        formData.append(
            'EndDate',
            this.model.endDate instanceof Date
                ? this.model.endDate.toISOString()
                : this.model.endDate
        );
        formData.append(
            'startTime',
            this.model.startTime instanceof Date
                ? this.formatTimeForInput(this.model.startTime)
                : this.model.startTime
        );
        formData.append(
            'endTime',
            this.model.endTime instanceof Date
                ? this.formatTimeForInput(this.model.endTime)
                : this.model.endTime
        );
        formData.append('IsVisible', this.model.isVisible.toString());
        formData.append('IsFreeCourse', this.model.isFreeCourse.toString());
        formData.append('Internal', this.model.internal.toString());
        formData.append('IsOnLine', this.model.isOnLine.toString());
        if (this.selectedFile) {
            formData.append('File', this.selectedFile, this.selectedFile.name);
            formData.append('Logopath', this.selectedFile.name);
        } else {
            formData.append('Logopath', this.model.logo || '');
        }

        if (this.isEditMode) {
            formData.append('Id', this.model.uid || '');
            if (this.model.courseId) {
                formData.append('CourseId', this.model.courseId.toString());
            }
        }

        this.isLoading = true;
        const serviceCall = this.isEditMode
            ? this.courseService.update(formData)
            : this.courseService.create(formData);

        serviceCall.subscribe({
            next: () => {
                const action = this.isEditMode ? 'updated' : 'created';
                this.toastService.showSuccess(`Course ${action} successfully`);
                this.loadCourses();
                this.resetForm();
                this.isLoading = false;
            },
            error: (err) => {
                const action = this.isEditMode ? 'update' : 'create';
                this.toastService.showError(`Failed to ${action} course`);
                console.error(`Error ${action}ing course:`, err);
                this.isLoading = false;
            },
        });
    }

    private combineDateTime(dateStr: string, timeStr: string): Date {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(
            (cat) => cat.courseCategoryId === categoryId
        );
        return category ? category.title : 'Unknown';
    }

    editCourse(course: Course): void {
        const uniqueDays = new Set<string>();

        if (Array.isArray(course.selectedDays)) {
            course.selectedDays.forEach((item) => {
                item.split(',').forEach((day) => {
                    const trimmed = day.trim();
                    if (trimmed) {
                        uniqueDays.add(trimmed);
                    }
                });
            });
        }
        this.model = {
            ...course,
            startDate: this.formatDateForInput(course.startDate),
            endDate: this.formatDateForInput(course.endDate),
            startTime: this.parseTime(course.startTime),
            endTime: this.parseTime(course.endTime),
            isFreeCourse: !!course.isFreeCourse,

            coursePrice: course.coursePrice,
            discount: course.discount,
            selectedDays: Array.from(uniqueDays),

            isVisible: !!course.isVisible,
            internal: !!course.internal,
            isOnLine: !!course.isOnLine,
        };

        console.log(this.model);
        this.isEditMode = true;
        this.selectedFile = null;
        this.formSubmitted = false;

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }
    private parseTime(time: string | Date): string {
        const d = new Date(time);
        if (!isNaN(d.getTime())) {
            const hours = ('0' + d.getHours()).slice(-2);
            const minutes = ('0' + d.getMinutes()).slice(-2);
            return `${hours}:${minutes}`;
        }

        const [hourStr, minuteStr] =
            typeof time === 'string' ? time.split(':') : ['00', '00'];
        return `${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}`;
    }

    deleteCourse(id: string): void {
        if (!id) return;

        this.toastService
            .confirm(
                'Confirm Deletion',
                'Are you sure you want to delete this course?'
            )
            .then((confirmed) => {
                if (confirmed) {
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
                            this.toastService.showError(
                                'Failed to delete course'
                            );
                            console.error('Error deleting course:', err);
                            this.isLoading = false;
                        },
                    });
                }
            });
    }

    resetForm(): void {
        this.model = {
            uid: '',
            courseTitle: '',
            description: '',
            courseCategoryId: 0,
            startDate: this.formatDateForInput(new Date()),
            endDate: this.formatDateForInput(new Date()),
            startTime: this.formatTimeForInput(new Date()),
            endTime: this.formatTimeForInput(new Date()),
            isVisible: false,
            isFreeCourse: false,
            isOnLine: false,
            internal: false,
            coursePrice: 0,
            discount: 0,
            selectedDays: [],
            logo: '',
        };
        this.selectedFile = null;
        this.isEditMode = false;
        this.formSubmitted = false;
        this.dateTimeError = '';

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    private formatDateForInput(date: string | Date): string {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    private formatTimeForInput(date: string | Date): string {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '00:00';

        const hours = ('0' + d.getHours()).slice(-2);
        const minutes = ('0' + d.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
    }

    getImageUrl(path: string | null): string {
        return this.apiService.getImageUrl(path);
    }

    getPageRange(): number[] {
        const visiblePages = 5; // Number of pages to show in the pagination
        let startPage = Math.max(
            1,
            this.currentPage - Math.floor(visiblePages / 2)
        );
        let endPage = startPage + visiblePages - 1;

        if (endPage > this.totalPages) {
            endPage = this.totalPages;
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
    }
}
