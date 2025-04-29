import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '../../admin/services/contact.service';
import { ToastNotificationService } from '../../toast-notification.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [NgClass, FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
})
export class ContactComponent {
    contactForm: FormGroup;
    isSubmitting = false;

    private toastService = inject(ToastNotificationService);

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private contactService: ContactService // you said service already created
    ) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required],
        });
    }

    submitContact() {
        if (this.contactForm.invalid) {
            this.contactForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        const contactData = this.contactForm.value;

        this.contactService.createContact(contactData).subscribe({
            next: (response) => {
                console.log('Contact created successfully', response);
                this.contactForm.reset();
                this.isSubmitting = false;
                // Show success toast or alert
                this.toastService.showSuccess('Contact created successfully');
            },
            error: (error) => {
                console.error('Error creating contact', error);
                this.isSubmitting = false;
                // Show error toast or alert
                this.toastService.showError(
                    'Error creating contact. Please try again.'
                );
            },
        });
    }
}
