import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../admin/models/user';
import { UserService } from '../../admin/services/users.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ToastNotificationService } from '../../toast-notification.service';
import { PageBannerComponent } from './page-banner/page-banner.component';

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
    user: User = {
        firstName: '',
        lastName: '',
        isActive: true,
        email: '',
        userName: '',
        password: '',
        confirmPassword: '',
    };
    showPassword = false;
    termsAccepted = false;
    isLoading = false;

    constructor(
        private userService: UserService,
        private toastService: ToastNotificationService,
        private router: Router
    ) {}

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

        if (!this.termsAccepted) {
            this.toastService.showError(
                'You must accept the terms and conditions'
            );
            return;
        }

        this.isLoading = true;

        this.userService.createUser(this.user).subscribe({
            next: () => {
                this.toastService.showSuccess('Registration successful!');
                this.router.navigate(['/login']);
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

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
}
