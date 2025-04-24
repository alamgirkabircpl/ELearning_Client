import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../admin/services/users.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        FooterComponent,
        BackToTopComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
    obj = {
        email: '',
    };

    isLoading = false;
    errorMessage = '';

    private http = inject(HttpClient);
    private router = inject(Router);
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private toast = inject(ToastNotificationService);
    private apiService = inject(ApiService);

    onSubmit() {
        console.log(this.obj);
        if (!this.obj.email) {
            this.errorMessage = 'Please enter your email';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.userService.forgotPassword(this.obj.email).subscribe({
            next: (response) => {
                console.log(response);
                this.toast.showSuccess(
                    'Please visit your email to reset password'
                );
                this.router.navigateByUrl('/');
            },
            error: (err) => {
                console.log(err.message);
                this.isLoading = false;
                // You might want to set an error message here too
                // this.errorMessage = 'Failed to send reset password email';
            },
        });
    }
}
