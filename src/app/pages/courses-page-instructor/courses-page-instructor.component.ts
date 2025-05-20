import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../admin/models/course';
import { Enroll } from '../../admin/models/enroll';
import { Instructor } from '../../admin/models/trainer';
import { User } from '../../admin/models/user';
import { PaymentComponent } from '../../admin/payment/payment.component';
import { CommonService } from '../../admin/services/common.service';
import { CourseService } from '../../admin/services/course.service';
import { EnrollService } from '../../admin/services/enroll.service';
import { InstructorService } from '../../admin/services/instructor.service';
import { UserService } from '../../admin/services/users.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';
// Update your CourseData interface to match the API response
interface CourseData {
    courseId: number;
    instructorRegId: string;
    courseUid: string;
    courseDescription: string;
    coursePrice: number;
    courseStartDate: string;
    courseEndDate: string;
    courseLogo: string;
    courseCategoryId: number;
    courseCategoryName: string;
    courseIsVisible: boolean;
    courseIsActive: boolean;
    courseIsFreeCourse: boolean;
    courseIsApproved: boolean;
    courseIsPaused: boolean;
    courseIsRejected: boolean;
    courseName: string;
    instructorId: number;
    instructorName: string;
    instructorQualification: string;
    instructorExperience: string;
    instructorDescription: string;
    instructorCertification: string;
    instructorLinkdinProfile: string;
    instructorProfilePic: string;
    email: string;
}

@Component({
    selector: 'app-courses-and-instructor-page',
    standalone: true,
    imports: [CommonModule, FormsModule, PaymentComponent],
    templateUrl: './courses-page-instructor.component.html',
    styleUrl: './courses-page-instructor.component.scss',
})
export class CoursesAndInstructorPageComponent implements OnInit {
    courses: CourseData[] = []; // Typed array
    selectedCourse: CourseData | null = null;
    isLoading = false;
    error: string | null = null;
    coursePrice: number | null = null;
    instructorId: string | null = null;

    instructor: Instructor | null = null;
    course: Course | null = null;
    user: User = {
        firstName: '',
        lastName: '',
        isActive: true,
        email: '',
        userName: '',
        password: 'Test@123%',
        confirmPassword: 'Test@123%',
    };

    showPassword = false;
    enroll: Enroll | null = null;

    // Injecting services
    private instructorService = inject(InstructorService);
    private courseServie = inject(CourseService);
    private enrollService = inject(EnrollService);
    private toastService = inject(ToastNotificationService);
    private commonService = inject(CommonService);
    private platFormService = inject(PlatformService);
    private authService = inject(AuthService);
    private router = inject(Router);

    private userService = inject(UserService);
    courseUId: string | null = null;
    instructorRegId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this.route.queryParams.subscribe((params) => {
            const courseUId = params['courseUId'];
            const instructorRegId = params['instructorRegId'];
            this.courseUId = courseUId;
            this.instructorRegId = instructorRegId;
            console.log('Course ID:', courseUId);
            console.log('Instructor ID:', instructorRegId);
        });
    }

    private courseService = inject(CourseService);
    private apiService = inject(ApiService);

    ngOnInit(): void {
        if (this.platFormService.isBrowser()) {
            const instructorId = this.route.snapshot.paramMap.get('id');
            console.log('Instructor ID:', instructorId);
            this.instructorId = instructorId;
            if (this.instructorId !== null) {
                this.loadInstructorAndCourseDetails(this.instructorId);
            }
        }
    }

    loadInstructorAndCourseDetails(instructorId: string): void {
        console.log('Loading courses...');

        this.isLoading = true;
        this.error = null;

        this.commonService.GetCourseAndInstructorDetails().subscribe({
            next: (data: any) => {
                this.courses = data?.filter(
                    (f: { instructorRegId: string }) =>
                        f.instructorRegId == this.instructorId
                );

                // if (this.instructorId && data) {
                //     console.log('first', this.instructorId, data);
                //     this.courses = data.filter(
                //         (x: { instructorDetailsId: number }) =>
                //             x.instructorDetailsId === instructorId
                //     );
                //     this.isLoading = false;
                //     console.log('Courses loaded successfully:', this.courses);
                // }
            },
            error: (err) => {
                console.error('Error loading courses:', err);
                this.error = 'Failed to load courses. Please try again later.';
                this.isLoading = false;
            },
        });
    }

    imagePrivew(src: string) {
        this.apiService.getImageUrl(src);
    }

    handleOpenCourseDetails(
        courseUid: string,
        instructorRegId: string,
        courseId: number
    ) {
        // Instead of alert, you would typically:
        // 1. Fetch course details based on these IDs
        // 2. Update the offcanvas content dynamically
        console.log(
            `Course UID: ${courseUid}, Instructor Reg ID: ${instructorRegId}`
        );

        // Example of what you might do:
        // this.loadCourseDetails(courseUid, instructorRegId);
        this.loadInstructorDetails(instructorRegId);
        this.loadCourseDetails(courseUid);
        this.loadCoursePrice(courseId);
    }

    loadInstructorDetails(instructorRegId: any) {
        if (instructorRegId) {
            this.instructorService.getById(instructorRegId).subscribe(
                (instructorArray) => {
                    console.log('Raw Instructor Array:', instructorArray);

                    // Extract the first instructor object
                    if (
                        Array.isArray(instructorArray) &&
                        instructorArray.length > 0
                    ) {
                        this.instructor = instructorArray[0];
                        console.log('Instructor Details:', this.instructor);
                    } else {
                        console.error('No instructor found for the given ID.');
                    }
                },
                (error) => {
                    console.error('Error fetching instructor details:', error);
                }
            );
        } else {
            console.error('Instructor ID is not available');
        }
    }

    loadCourseDetails(courseUId: any) {
        if (courseUId) {
            this.courseServie.getById(courseUId).subscribe(
                (course) => {
                    console.log('Course Details:', course);
                    this.course = course;
                },
                (error) => {
                    console.error('Error fetching course details:', error);
                }
            );
        }
    }

    loadCoursePrice(courseUId: any) {
        if (courseUId) {
            this.commonService.GetCoursePrice(courseUId).subscribe(
                (course) => {
                    this.coursePrice = course.price;
                    console.log('Course Details:', course.price);
                },
                (error) => {
                    console.error('Error fetching course details:', error);
                }
            );
        }
    }

    onSubmit(form: NgForm): void {
        if (this.authService.isLoggedIn()) {
            console.log(this.authService.getCurrentUser());
            if (this.course && this.instructor && this.user.id) {
                const enrollData = {
                    id: this.user.id,
                    courseId: this.course.courseId,
                    isApproved: true,
                    isCompleted: false,
                    isPaid: true,
                    isRefunded: false,
                    isFree: false,
                    enrollDate: new Date().toISOString(),
                    isTrial: false,
                    isActive: true,
                    isReject: false,
                    instructorDetailsId: this.instructor.instructorDetailsId,
                };
                console.log('Enroll Data:', enrollData);
                this.enrollService.create(enrollData).subscribe(
                    (response) => {
                        this.toastService.showSuccess('Enrollment successful');
                        console.log('Enrollment successful:', response);
                        // Handle success, e.g., show a success message or redirect
                        this.loadEnrollDetails(response.enrollId);
                    },
                    (error) => {
                        this.toastService.showError('Enrollment failed');
                        console.error('Enrollment failed:', error);
                        // Handle error, e.g., show an error message
                    }
                );
            }
        } else {
            this.router.navigate(['/register']);
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
    resetForm(form: NgForm): void {
        this.user = {
            firstName: '',
            lastName: '',
            isActive: true,
            email: '',
            userName: '',
        };
        this.showPassword = false;
        this.isLoading = false;
        form.resetForm();
    }

    loadEnrollDetails(enrollId: string) {
        this.enrollService.getById(enrollId).subscribe(
            (enroll) => {
                console.log('Enroll Details:', enroll);
                this.enroll = enroll;
            },
            (error) => {
                console.error('Error fetching enroll details:', error);
            }
        );
    }
    getSanitizedContent(html: string) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    getImagePath(imageName: string): string {
        return this.apiService.getImageUrl(imageName);
    }

    convertTo12Hour(time: string | Date | undefined): string {
        if (!time) return '';

        let date: Date;

        if (typeof time === 'string') {
            // Assume format is "HH:mm"
            const [hours, minutes] = time.split(':');
            date = new Date();
            date.setHours(+hours);
            date.setMinutes(+minutes);
        } else {
            // It's already a Date
            date = time;
        }

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        const paddedMinutes = minutes.toString().padStart(2, '0');

        return `${hour12}:${paddedMinutes} ${ampm}`;
    }
}
