import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ToastNotificationService } from '../../toast-notification.service';
import { PageBannerComponent } from './page-banner/page-banner.component';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
    loginObj = {
        email: 'alamgir.kabir@projukti-bd.com',
        password: 'Alamgir@123%',
    };

    isLoading = false;
    errorMessage = '';

    private http = inject(HttpClient);
    private router = inject(Router);
    private authService = inject(AuthService);
    private toast = inject(ToastNotificationService);
    private apiService = inject(ApiService); // Renamed from baseUrl to apiService
    onLogin() {
        console.log(this.loginObj);
        if (!this.loginObj.email || !this.loginObj.password) {
            this.errorMessage = 'Please enter both email and password';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.http
            .post<{
                data: any;
                token: string;
                refreshToken: string;
            }>(
                this.apiService.getFullUrl('api/ApplicationUser/authenticate'),

                this.loginObj
            )
            .pipe(
                catchError((error) => {
                    console.error('Login error:', error);
                    this.toast.showError('Something wen wrong!!!');
                    this.errorMessage =
                        error.error?.message ||
                        'Login failed. Please try again.';
                    return of(null);
                }),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe((response) => {
                console.log(response);
                if (response !== null) {
                    console.log(response);
                    this.authService.setTokens(
                        response.data.jwToken,
                        response.data.refreshToken
                    );

                    this.toast.showSuccess('You are successfully login!!!');
                    // Redirect to stored URL or default dashboard
                    const returnUrl =
                        this.authService.getReturnUrl() || '/admin/dashboard';
                    console.log(returnUrl);
                    this.router.navigateByUrl(returnUrl);
                }
            });
    }

    loginWith(provider: string) {
        this.isLoading = true;
        this.errorMessage = '';

        window.location.href = `http://localhost:44449/api/ApplicationUser/external-login?provider=${provider}&returnUrl=http://localhost:4200/login-callback`;
    }
}
