import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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
    imports: [CommonModule, FormsModule, CKEditorModule],
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
    filteredInstructor: Instructor[] = [];
    users: User[] = [];
    selectedUser: { id: string; email: string } = {
        id: '',
        email: '',
    };

    // Pagination
    // Pagination
    currentPage = 1;
    pageSize = 2;
    totalPages = 0;
    searchText = '';

    // Form state
    instructor: Instructor = this.createEmptyInstructor();
    selectedFile: File | null = null;
    profileImagePreview: string | null = null;
    //  profileImagePreview: string | null = 'images/defaultprofileimage.webp';

    showPassword = false;
    isSubmitting = false;
    isEditMode = false;
    isLoading = false;
    isSelectedUser = false;

    public Editor: any;
    public config: any;
    public initialData = '<p>Write description here...</p>';
    // DataTable options
    dtOptions: any;

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
        this.loadInstructors();
        this.loadUser();
    }

    loadUser() {
        this.userService.getAllUser().subscribe((res) => {
            this.users = Array.isArray(res) ? res : [res];
            console.log(res);
        });
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
        this.isLoading = true;

        this.instructorService.getAll().subscribe({
            next: (res) => {
                this.instructors = res.map((instructor) => ({
                    ...instructor,
                    profilePicture:
                        instructor.profilePicture ||
                        'assets/images/default-profile.png',
                }));
                this.applyFilter();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching instructors:', err);
                this.toastService.showError('Failed to load instructors');
                this.isLoading = false;
            },
        });
    }

    applyFilter(): void {
        const search = this.searchText.toLowerCase();
        this.filteredInstructor = this.instructors.filter(
            (cat) =>
                cat.firstName.toLowerCase().includes(search) ||
                cat.description.toLowerCase().includes(search)
        );
        this.totalPages = Math.ceil(
            this.filteredInstructor.length / this.pageSize
        );
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
        }
        console.log(
            'first,',
            this.totalPages,
            this.currentPage,
            this.instructor
        );
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
        if (this.isSelectedUser) {
            const formData = this.createInstructorFormData();
            formData.append('id', this.selectedUser.id);

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
                    this.toastService.showError('Failed to create instructor');
                    this.isSubmitting = false;
                },
            });
        } else {
            if (this.instructor.password !== this.instructor.confirmPassword) {
                this.toastService.showError('Passwords do not match');
                return;
            }

            this.isSubmitting = true;
            const userData: User = {
                firstName: this.instructor.firstName,
                lastName: this.instructor.lastName,
                email: this.instructor.email,
                userName: this.instructor.email,
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

        this.toastService
            .confirm(
                'Confirm Deletion',
                'Are you sure you want to delete this category?'
            )
            .then((confirmed) => {
                if (!confirmed) {
                    this.toastService.showInfo('Deletion cancelled');
                    return;
                }

                this.isLoading = true;
                this.instructorService.delete(id).subscribe({
                    next: () => {
                        this.toastService.showSuccess(
                            'Instructor deleted successfully'
                        );
                        this.loadInstructors();
                    },
                    error: (err) => {
                        console.error('Error deleting instructor:', err);
                        this.toastService.showError(
                            'Failed to delete instructor'
                        );
                    },
                });
            });
    }

    resetForm(): void {
        this.instructor = this.createEmptyInstructor();
        this.selectedFile = null;
        this.profileImagePreview = null;
        this.isEditMode = false;
        this.isSubmitting = false;
        this.selectedUser = { id: '', email: '' }; // For Option 1
        this.isSelectedUser = false;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
    getImageUrl(path: string | null): string {
        return this.apiService.getImageUrl(path);
    }
    // Template helper
    Math = Math;

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
    onUserSelect(): void {
        console.log('I am calling');
        if (this.selectedUser && this.selectedUser.id) {
            const alreadyExist = this.instructors.find(
                (ins) => ins.id == this.selectedUser.id
            );
            if (!alreadyExist) {
                const selectedUser = this.users.find(
                    (user) => user.id === this.selectedUser.id
                );
                console.log(selectedUser, this.instructor);

                if (selectedUser) {
                    this.instructor.firstName = selectedUser.firstName;
                    this.instructor.lastName = selectedUser.lastName;
                    this.instructor.email = selectedUser.email;
                    this.instructor.userName = selectedUser.userName;
                }
                this.isSelectedUser = true;
            } else {
                this.toastService.showWarning('Instructor already exist!!!');
                this.isSelectedUser = false;

                // Reset the fields if no user is selected
                this.instructor.firstName = '';
                this.instructor.lastName = '';
                this.instructor.email = '';
                this.instructor.userName = '';
                this.selectedUser = { id: '', email: '' }; // For Option 1
            }
        } else {
            this.isSelectedUser = false;

            // Reset the fields if no user is selected
            this.instructor.firstName = '';
            this.instructor.lastName = '';
            this.instructor.email = '';
            this.instructor.userName = '';
            this.selectedUser = { id: '', email: '' }; // For Option 1
        }
    }
    ngOnDestroy(): void {}
}
