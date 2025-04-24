import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';
import { PageBannerComponent } from './page-banner/page-banner.component';
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
    selector: 'app-courses-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
        CommonModule,
        FormsModule,
        PaymentComponent,
    ],
    templateUrl: './courses-page.component.html',
    styleUrl: './courses-page.component.scss',
})
export class CoursesPageComponent implements OnInit {
    courses: CourseData[] = []; // Typed array
    selectedCourse: CourseData | null = null;
    isLoading = false;
    error: string | null = null;

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

    private userService = inject(UserService);
    courseUId: string | null = null;
    instructorRegId: string | null = null;
    constructor(private route: ActivatedRoute) {
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
            this.loadInstructorAndCourseDetails();
        }
    }

    loadInstructorAndCourseDetails(): void {
        console.log('Loading courses...');
        this.isLoading = true;
        this.error = null;

        this.commonService.GetCourseAndInstructorDetails().subscribe({
            next: (data: any) => {
                this.courses = data;
                this.isLoading = false;
                console.log('Courses loaded successfully:', this.courses);
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

    handleOpenCourseDetails(courseUid: string, instructorRegId: string) {
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

    onSubmit(form: NgForm): void {
        if (form.invalid) {
            this.toastService.showError(
                'Please fill all required fields correctly'
            );
            return;
        }
        this.isLoading = true;

        if (this.user.password !== this.user.confirmPassword) {
            this.toastService.showError('Passwords do not match');
            return;
        }
        console.log(this.user);
        this.commonService
            .GetUserByEmail(this.user.email)
            .subscribe((response) => {
                if (response) {
                    this.user.id = response.id;
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
                            instructorDetailsId:
                                this.instructor.instructorDetailsId,
                        };
                        console.log('Enroll Data:', enrollData);
                        this.enrollService.create(enrollData).subscribe(
                            (response) => {
                                this.toastService.showSuccess(
                                    'Enrollment successful'
                                );
                                console.log('Enrollment successful:', response);
                                // Handle success, e.g., show a success message or redirect
                                this.loadEnrollDetails(response.enrollId);
                            },
                            (error) => {
                                this.toastService.showError(
                                    'Enrollment failed'
                                );
                                console.error('Enrollment failed:', error);
                                // Handle error, e.g., show an error message
                            }
                        );
                    }
                } else {
                    this.userService.createUser(this.user).subscribe({
                        next: (response) => {
                            this.toastService.showSuccess(
                                'Registration successful!'
                            );
                            const userId = response.data.id;
                            console.log('User ID:', userId);

                            if (this.course && this.instructor) {
                                const enrollData = {
                                    id: userId,
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
                                    instructorDetailsId:
                                        this.instructor.instructorDetailsId,
                                };
                                console.log('Enroll Data:', enrollData);
                                this.enrollService.create(enrollData).subscribe(
                                    (response) => {
                                        this.toastService.showSuccess(
                                            'Enrollment successful'
                                        );
                                        console.log(
                                            'Enrollment successful:',
                                            response
                                        );
                                        // Handle success, e.g., show a success message or redirect
                                    },
                                    (error) => {
                                        this.toastService.showError(
                                            'Enrollment failed'
                                        );
                                        console.error(
                                            'Enrollment failed:',
                                            error
                                        );
                                        // Handle error, e.g., show an error message
                                    }
                                );
                            }
                        },
                        error: (err) => {
                            console.error('Registration failed:', err);
                            this.toastService.showError(
                                'Registration failed. Please try again.'
                            );
                            this.isLoading = false;
                        },
                        complete: () => {
                            this.isLoading = false;
                        },
                    });
                }
            });
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
}
