import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../admin/services/users.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-confirm-email',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        NavbarComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss',
})

// ConfirmEmailComponent
export class ConfirmEmailComponent implements OnInit {
    isProcessing = true;
    isSuccess = false;
    errorMessage = '';
    private platFormService = inject(PlatformService);
    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private toastMsg: ToastNotificationService
    ) {}

    ngOnInit() {
        if (this.platFormService.isBrowser()) {
            this.confirmEmail(); // only run on browser
        }
    }

    private confirmEmail(): void {
        const params = this.route.snapshot.queryParams;
        const userId = params['userId'];
        const code = params['code'];

        if (!userId || !code) {
            this.handleError('Invalid confirmation link');
            return;
        }

        this.userService.confirmEmail(userId, code).subscribe({
            next: () => this.handleSuccess(),
            error: (err) =>
                this.handleError(err.message || 'Email confirmation failed'),
        });
    }

    private handleSuccess(): void {
        this.isSuccess = true;
        this.isProcessing = false;
        this.toastMsg.showSuccess(
            'Your email has been confirmed successfully!'
        );

        // Redirect to home after 3 seconds
        setTimeout(() => {
            this.router.navigate(['/'], {
                queryParamsHandling: 'preserve', // Optional: preserve query params if needed
            });
        }, 3000);
    }

    private handleError(message: string): void {
        this.errorMessage = message;
        this.isProcessing = false;
        this.toastMsg.showError(message || 'Something went wrong!');
    }
}
