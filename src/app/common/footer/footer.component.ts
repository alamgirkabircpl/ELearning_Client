import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubscribeService } from '../../admin/services/subscribe.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink, NgIf, ReactiveFormsModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    subscribeForm: FormGroup;
    isSubmitting = false;
    currentYear = new Date().getFullYear();
    private toastService = inject(ToastNotificationService);

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private subscribeService: SubscribeService // you said services are ready
    ) {
        this.subscribeForm = this.fb.group({
            subscribeEmail: ['', [Validators.required, Validators.email]],
        });
    }

    submitSubscribe() {
        if (this.subscribeForm.invalid) {
            this.subscribeForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        const subscribeData = this.subscribeForm.value;

        this.subscribeService.createSubscribe(subscribeData).subscribe({
            next: (response) => {
                console.log('Subscribed successfully', response);
                this.subscribeForm.reset();
                this.isSubmitting = false;
                this.toastService.showSuccess('Subscribed successfully');
                // Show success toast if needed
            },
            error: (error) => {
                console.error('Error subscribing', error);
                this.isSubmitting = false;
                this.toastService.showError('Error subscribing');
                // Show error toast if needed
            },
        });
    }
}
