import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../admin/services/users.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ToastNotificationService } from '../../toast-notification.service';

export interface ResetPass {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        NavbarComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
    user: ResetPass = {
        token: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    showPassword = false;
    termsAccepted = false;
    isLoading = false;
    private toastService = inject(ToastNotificationService);
    private router = inject(Router);
    private userService = inject(UserService);
    constructor(private route: ActivatedRoute) {
        this.route.queryParams.subscribe((params) => {
            const token = decodeURIComponent(params['token']);
            const email = decodeURIComponent(params['email']);

            // Optional: Verify token immediately when page loads
            console.log({ token, email });
            this.user.email = email;
            this.user.token = token;
        });
    }

    onSubmit(form: NgForm): void {
        if (form.invalid) {
            this.toastService.showError(
                'Please fill all required fields correctly'
            );
            return;
        }

        if (this.user.password !== this.user.confirmPassword) {
            this.toastService.showError('Passwords do not match');
            return;
        }

        this.isLoading = true;

        this.userService.resetPassword(this.user).subscribe({
            next: () => {
                this.toastService.showSuccess(
                    'Password has been successfully reset !'
                );
                this.router.navigate(['/login']);
            },
            error: (err: unknown) => {
                this.toastService.showError('Something went wrong !!!.');
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
}
