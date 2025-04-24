import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../admin/services/users.service';
import { AuthService } from '../../auth.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ToastNotificationService } from '../../toast-notification.service';

export interface ChangePassword {
    email: string;
    currentPassword: string;
    newPassword: string;
}

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        FooterComponent,
        BackToTopComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
    changePasswordObj: ChangePassword = {
        email: '',
        currentPassword: '',
        newPassword: '',
    };

    isLoading = false;
    errorMessage = '';
    showPassword = false;
    showCurrentPassword = false;
    showNewPassword = false;

    private router = inject(Router);
    private userService = inject(UserService);
    private toast = inject(ToastNotificationService);
    private authService = inject(AuthService);

    onSubmit(form: NgForm) {
        if (form.invalid) {
            this.toast.showError('Please fill all required fields correctly');
            return;
        }

        if (
            this.changePasswordObj.currentPassword ===
            this.changePasswordObj.newPassword
        ) {
            this.toast.showError(
                'New password must be different from current password'
            );
            return;
        }

        this.isLoading = true;

        this.userService.passwordChange(this.changePasswordObj).subscribe({
            next: () => {
                this.toast.showSuccess('Password changed successfully!');
                this.authService.logout(); // Optional: Force logout after password change
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.errorMessage =
                    err.error?.message || 'Failed to change password';
                this.toast.showError(this.errorMessage);
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    togglePasswordVisibility(field: 'current' | 'new'): void {
        if (field === 'current') {
            this.showCurrentPassword = !this.showCurrentPassword;
        } else {
            this.showNewPassword = !this.showNewPassword;
        }
    }
}
