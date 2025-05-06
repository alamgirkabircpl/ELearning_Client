import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../admin/models/course';
import { Instructor } from '../../admin/models/trainer';
import { PaymentComponent } from '../../admin/payment/payment.component';
import { AssignCourseService } from '../../admin/services/assign-course.service';
import { CommonService } from '../../admin/services/common.service';
import { CourseService } from '../../admin/services/course.service';
import { EnrollService } from '../../admin/services/enroll.service';
import { InstructorService } from '../../admin/services/instructor.service';
import { UserService } from '../../admin/services/users.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { CourseData } from '../../pages/courses-page/courses-page.component';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [RouterLink, CommonModule, PaymentComponent],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
    assignCourse: any[] = [];
    coursePrice: number | null = null;
    selectedCourse: CourseData | null = null;

    instructor: Instructor | null = null;
    course: Course | null = null;

    assignCourseService = inject(AssignCourseService);
    commonService = inject(CommonService);
    apiService = inject(ApiService);
    // Injecting services
    private instructorService = inject(InstructorService);
    private courseServie = inject(CourseService);
    private enrollService = inject(EnrollService);
    private toastService = inject(ToastNotificationService);
    private authService = inject(AuthService);

    private userService = inject(UserService);
    courseUId: string | null = null;
    instructorRegId: string | null = null;

    platFormService = inject(PlatformService);
    router = inject(Router);
    constructor(private sanitizer: DomSanitizer) {}
    ngOnInit(): void {
        if (this.platFormService.isBrowser()) {
            this.loadAssignCourse();
        }
    }

    loadAssignCourse() {
        this.commonService.GetCourseAndInstructorDetails().subscribe({
            next: (courses: any) => {
                console.log('Courses:', courses);
                this.assignCourse = courses;
            },
            error: (err) => console.error('Error loading courses', err),
        });
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
    getSanitizedContent(html: string) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    getImageUrl(imagePath: string): string {
        return this.apiService.getImageUrl(imagePath);
    }
}
