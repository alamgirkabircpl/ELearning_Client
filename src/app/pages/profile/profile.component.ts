import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
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
        ReactiveFormsModule,
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    userData: any;
    enrollDetails: any[] = [];
    activeTab: string = 'profile';
    isEditMode: boolean = false;
    profileForm: FormGroup;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private toastService: ToastNotificationService,
        private platformService: PlatformService,
        private enrollService: EnrollService,
        private commonService: CommonService,
        private apiService: ApiService,
        private fb: FormBuilder
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            userName: ['', [Validators.required, Validators.email]],
            phone: [''],
            bio: [''],
        });
    }

    ngOnInit(): void {
        this.authService.initializeUserFromToken();
        this.getUser();
    }

    getUser() {
        if (this.authService.isLoggedIn()) {
            const user = this.authService.getCurrentUser();
            this.userService
                .getUserByEmail(user.email)
                .subscribe((response) => {
                    this.userData = response;
                    this.loadEnrollDetails(this.userData.userId);
                    this.initializeForm();
                });
        }
    }

    initializeForm(): void {
        this.profileForm.patchValue({
            firstName: this.userData?.firstName || '',
            lastName: this.userData?.lastName || '',
            email: this.userData?.email || '',
            userName: this.userData?.email,
            phone: this.userData?.phone || '',
            bio: this.userData?.bio || '',
        });
    }

    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.initializeForm();
        }
    }
    saveProfile(): void {
        if (this.profileForm.valid) {
            // Make sure userName is set to email before saving
            const formData = this.profileForm.value;
            const updatedData = {
                ...formData,
                userName: formData.email, // Force userName to match email
            };

            this.userService.updateUser(updatedData).subscribe({
                next: (response) => {
                    this.userData = { ...this.userData, ...updatedData };
                    this.toastService.showSuccess(
                        'Profile updated successfully'
                    );
                    this.isEditMode = false;
                },
                error: (error) => {
                    this.toastService.showError('Failed to update profile');
                    console.error('Error updating profile:', error);
                },
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
