import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../admin/services/common.service';
import { EnrollService } from '../../admin/services/enroll.service';
import { UserService } from '../../admin/services/users.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        NavbarComponent,
        FooterComponent,
        BackToTopComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    userData: any;
    enrollDetails: any[] = [];
    activeTab: string = 'profile'; // Default tab

    // CommonService is injected directly into the constructor
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private toastService: ToastNotificationService,
        private platformService: PlatformService,
        private enrollService: EnrollService,
        private commonService: CommonService,
        private apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.authService.initializeUserFromToken();
        this.getUser(); // Load user data when component initializes
    }

    // Fetch the user data based on the logged-in user
    getUser() {
        if (this.authService.isLoggedIn()) {
            const user = this.authService.getCurrentUser(); // Assuming this returns the user data
            this.userService
                .getUserByEmail(user.email)
                .subscribe((response) => {
                    this.userData = response;
                    console.log('User data:', this.userData);
                    this.loadEnrollDetails(this.userData.userId); // Load enrollment details for the user
                });
        }
    }

    // Switch between profile and course tabs
    selectTab(tab: string): void {
        this.activeTab = tab;
        if (tab === 'course') {
            this.loadEnrollDetails(this.userData.id); // Ensure the correct userId is passed
        }
    }

    // Fetch the enrollment details for the logged-in user
    loadEnrollDetails(userId: string): void {
        if (userId) {
            this.commonService.GetEnrolmentDetailsByUserId(userId).subscribe(
                (response) => {
                    console.log('Enrollment details:', response);
                    // Assuming response is an array of enrollments
                    this.enrollDetails = response.map((enrollment: any) => ({
                        courseName: enrollment.course.courseTitle,
                        courseDescription: enrollment.course.description,
                        startDate: enrollment.course.startDate,
                        endDate: enrollment.course.endDate,
                        courseId: enrollment.course.id,
                        price: enrollment.course.price,

                        courseLogo: enrollment.course.logo, // Optional for displaying the course logo
                        instructorName: enrollment.instructorDetails?.fullName, // Optional for instructor's image

                        profilePicture:
                            enrollment.instructorDetails?.profilePicture, // Optional for instructor's image
                    }));
                },
                (error) => {
                    console.error('Error fetching enrollment details:', error);
                    this.toastService.showError(
                        'Failed to load enrollment details.'
                    );
                }
            );
        }
    }

    getImagePath(imagePath: string): string {
        return this.apiService.getImageUrl(imagePath);
    }
}
