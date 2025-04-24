import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { PlatformService } from '../../../platform.service';
import { ToastNotificationService } from '../../../toast-notification.service';
import { Instructor } from '../../models/trainer';
import { User } from '../../models/user';
import { InstructorService } from '../../services/instructor.service';
import { UserService } from '../../services/users.service';

@Component({
    selector: 'app-instructor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './instructor.component.html',
    styleUrls: ['./instructor.component.scss'],
})
export class InstructorComponent {
    private instructorService = inject(InstructorService);
    private userService = inject(UserService);
    private toastService = inject(ToastNotificationService);
    private apiService = inject(ApiService);
    private platformService = inject(PlatformService);
    instructors: Instructor[] = [];
    pagedInstructors: Instructor[] = [];

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    visiblePages: number[] = [];

    // Form state
    instructor: Instructor = this.createEmptyInstructor();
    selectedFile: File | null = null;
    profileImagePreview: string | null = null;
    showPassword = false;
    isSubmitting = false;
    isEditMode = false;

    // DataTable options
    dtOptions: any;

    ngOnInit(): void {
        if (this.platformService.isBrowser()) {
            this.loadInstructors();

            this.dtOptions = {
                pagingType: 'full_numbers',
            };
        }
    }

    private createEmptyInstructor(): Instructor {
        return {
            id: '',
            firstName: '',
            lastName: '',
            qualification: '',
            certification: '',
            description: '',
            experience: '',
            isActive: false,
            email: '',
            userName: '',
            password: 'Test@123%',
            confirmPassword: 'Test@123%',
            linkdinProfile: '',
            profilePicture: 'assets/images/default-profile.png',
        };
    }

    private loadInstructors(): void {
        this.instructorService.getAll().subscribe({
            next: (res) => {
                this.instructors = res.map((instructor) => ({
                    ...instructor,
                    profilePicture:
                        instructor.profilePicture ||
                        'assets/images/default-profile.png',
                }));
                this.updatePagination();
            },
            error: (err) => {
                console.error('Error fetching instructors:', err);
                this.toastService.showError('Failed to load instructors');
            },
        });
    }

    // Pagination methods
    updatePagination(): void {
        this.totalPages = Math.ceil(
            this.instructors.length / this.itemsPerPage
        );

        // Calculate visible pages (max 5 pages shown)
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, this.currentPage - halfVisible);
        let endPage = Math.min(
            this.totalPages,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        this.visiblePages = Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );

        // Update paged data
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.pagedInstructors = this.instructors.slice(
            startIndex,
            startIndex + this.itemsPerPage
        );
    }

    setPage(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    onPageSizeChange(): void {
        this.currentPage = 1;
        this.updatePagination();
    }

    // File handling
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile = input.files[0];

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.profileImagePreview = reader.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    removeImage(): void {
        this.selectedFile = null;
        this.profileImagePreview = null;
        this.instructor.profilePicture = 'assets/images/default-profile.png';
    }

    // Form submission
    onSubmit(): void {
        if (this.isSubmitting) return;

        if (this.isEditMode) {
            this.updateInstructor();
        } else {
            this.createInstructor();
        }
    }

    private updateInstructor(): void {
        this.isSubmitting = true;
        const formData = this.createInstructorFormData();

        this.instructorService.update(formData).subscribe({
            next: () => {
                this.toastService.showSuccess(
                    'Instructor updated successfully'
                );
                this.resetForm();
                this.loadInstructors();
            },
            error: (err) => {
                console.error('Error updating instructor:', err);
                this.toastService.showError('Failed to update instructor');
                this.isSubmitting = false;
            },
            complete: () => {
                this.isSubmitting = false;
            },
        });
    }

    private createInstructor(): void {
        if (this.instructor.password !== this.instructor.confirmPassword) {
            this.toastService.showError('Passwords do not match');
            return;
        }

        this.isSubmitting = true;
        const userData: User = {
            firstName: this.instructor.firstName,
            lastName: this.instructor.lastName,
            email: this.instructor.email,
            userName: this.instructor.userName,
            password: this.instructor.password,
            confirmPassword: this.instructor.confirmPassword,
            isActive: true,
        };

        this.userService.createUser(userData).subscribe({
            next: (userResponse) => {
                this.toastService.showSuccess('User created successfully');

                const formData = this.createInstructorFormData();
                formData.append('id', userResponse.data.id);

                this.instructorService.create(formData).subscribe({
                    next: () => {
                        this.toastService.showSuccess(
                            'Instructor created successfully'
                        );
                        this.resetForm();
                        this.loadInstructors();
                    },
                    error: (err) => {
                        console.error('Error creating instructor:', err);
                        this.toastService.showError(
                            'Failed to create instructor'
                        );
                        this.isSubmitting = false;
                    },
                });
            },
            error: (err) => {
                console.error('Error creating user:', err);
                this.toastService.showError('Failed to create user');
                this.isSubmitting = false;
            },
        });
    }

    private createInstructorFormData(): FormData {
        const formData = new FormData();

        if (this.instructor.id) {
            formData.append('id', this.instructor.id);
        }

        if (this.instructor.instructorDetailsId) {
            formData.append(
                'instructorDetailsId',
                this.instructor.instructorDetailsId.toString()
            );
        }

        formData.append('description', this.instructor.description || '');
        formData.append('isActive', this.instructor.isActive.toString());
        formData.append('experience', this.instructor.experience || '');
        formData.append('certification', this.instructor.certification || '');
        formData.append('qualification', this.instructor.qualification || '');

        if (this.selectedFile) {
            formData.append('File', this.selectedFile, this.selectedFile.name);
            formData.append('profilePicture', this.selectedFile.name);
        } else if (this.instructor.profilePicture) {
            formData.append('profilePicture', this.instructor.profilePicture);
        }

        if (this.instructor.linkdinProfile) {
            formData.append('linkdinProfile', this.instructor.linkdinProfile);
        }

        return formData;
    }

    edit(instructor: Instructor): void {
        this.isEditMode = true;
        this.instructor = { ...instructor };
        this.profileImagePreview = instructor.profilePicture?.startsWith(
            'data:'
        )
            ? instructor.profilePicture
            : null;
    }

    delete(id?: string): void {
        if (!id) return;

        if (confirm('Are you sure you want to delete this instructor?')) {
            this.instructorService.delete(id).subscribe({
                next: () => {
                    this.toastService.showSuccess(
                        'Instructor deleted successfully'
                    );
                    this.loadInstructors();
                },
                error: (err) => {
                    console.error('Error deleting instructor:', err);
                    this.toastService.showError('Failed to delete instructor');
                },
            });
        }
    }

    resetForm(): void {
        this.instructor = this.createEmptyInstructor();
        this.selectedFile = null;
        this.profileImagePreview = null;
        this.isEditMode = false;
        this.isSubmitting = false;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
    getImageUrl(path: string | null): string {
        return this.apiService.getImageUrl(path);
    }
    // Template helper
    Math = Math;
}
