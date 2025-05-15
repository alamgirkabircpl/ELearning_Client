import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { AuthService } from '../../auth.service';
import { PlatformService } from '../../platform.service';
import { ToastNotificationService } from '../../toast-notification.service';
import { CommonService } from '../services/common.service';
import { CoursePaymentService } from '../services/course-payment.service';
import { EnrollService } from '../services/enroll.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
    @Input() selectedCourseId: number | string = '';
    @Input() paymentData: any;

    stripe!: Stripe | null;
    card!: StripeCardElement;
    private authService = inject(AuthService);
    private router = inject(Router);
    private enrollService = inject(EnrollService);
    private coursePaymentService = inject(CoursePaymentService);

    private toastService = inject(ToastNotificationService);
    private commonService = inject(CommonService);
    private platFormService = inject(PlatformService);
    constructor(private http: HttpClient) {}

    async ngOnInit() {
        this.authService.initializeUserFromToken();

        console.log('Received courseId:', this.selectedCourseId);
        this.stripe = await loadStripe(
            'pk_test_51PtN3qLo9zV8WUcX9DGaAqlvwYRsGPQyPDfp2EyOgP3AhjE9zaqvKbu6IOOzP0LI6MmQo6P2wimVKKsRquPAMrtB00R4lGfW9Q'
        );

        const elements = this.stripe!.elements();
        this.card = elements.create('card');
        this.card.mount('#card-element');
    }

    async pay(event: Event) {
        event.preventDefault();

        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/register']);
            return;
        }

        const user = this.authService.getCurrentUser(); // Assuming this returns the user data
        let loggedInUserId: string = '';

        // Check if the user object is available
        if (
            user &&
            user[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
            ]
        ) {
            loggedInUserId =
                user[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ];
            console.log('User ID:', loggedInUserId);
        } else {
            console.log('User ID not found');
            this.toastService.showError('User ID not found.');
            return;
        }

        if (
            !user ||
            !this.paymentData?.course ||
            !this.paymentData?.instructor
        ) {
            this.toastService.showError('Missing payment data.');
            return;
        }

        try {
            const enrollData = this.buildEnrollData(loggedInUserId);
            console.log(this.paymentData.course.coursePrice);

            // Step 1: Process the payment
            const { clientSecret }: any = await this.coursePaymentService
                .pay({
                    amount: this.paymentData.course.coursePrice, // Amount in cents
                })
                .toPromise();

            const paymentResult = await this.confirmStripePayment(clientSecret);

            if (paymentResult.error) {
                console.error('Payment failed:', paymentResult.error.message);
                this.toastService.showError(
                    'Payment failed: ' + paymentResult.error.message
                );
                return;
            }

            if (paymentResult.paymentIntent?.status === 'succeeded') {
                console.log('💰 Payment successful!');

                // Step 2: Create the enrollment
                const enrollmentResponse = await this.enrollService
                    .create(enrollData)
                    .toPromise();
                const userId = enrollmentResponse.id; // Assuming response contains the generated userId
                const enrollId = enrollmentResponse.enrollId; // Assuming response contains the generated enrollId
                console.log('Enrollment response:', enrollmentResponse);
                if (enrollId) {
                    console.log('Enrollment successful, enrollId:', enrollId);

                    // Step 3: Send payment data along with enrollId to the server
                    const paymentObj = {
                        enrollId: enrollId, // Use the enrollId from the created enrollment
                        id: userId,
                        gateway: 'Stripe',
                        transactionId: paymentResult.paymentIntent.id,
                        sessionId: paymentResult.paymentIntent.id,
                        paymentStatus: true,
                        amount: paymentResult.paymentIntent.amount / 100, // Convert from cents to dollars
                        currency: paymentResult.paymentIntent.currency,
                        paymentDate: new Date().toISOString(),
                        // receiptUrl: paymentResult.paymentIntent?.charges.data[0]?.receipt_url || 'No receipt URL available',
                        //responseDataJson: JSON.stringify(paymentResult),
                    };
                    console.log(paymentObj);
                    // Send the payment details to your server
                    this.coursePaymentService.paymentPost(paymentObj).subscribe(
                        (response) => {
                            console.log('Payment response:', response);
                            this.toastService.showSuccess(
                                'Payment and enrollment successful!'
                            );
                        },
                        (error) => {
                            console.error('Error sending payment data:', error);
                            this.toastService.showError(
                                'Failed to save payment data.'
                            );
                        }
                    );
                } else {
                    console.error('Enrollment failed');
                    this.toastService.showError('Enrollment failed.');
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.toastService.showError('Payment process failed.');
        }
    }

    private buildEnrollData(userId: string) {
        return {
            id: userId,
            courseId: this.paymentData.course.courseId,
            isApproved: true,
            isCompleted: false,
            isPaid: true,
            isRefunded: false,
            isFree: false,
            enrollDate: new Date().toISOString(),
            isTrial: false,
            isActive: true,
            isReject: false,
            instructorDetailsId:
                this.paymentData.instructor.instructorDetailsId,
        };
    }

    private async confirmStripePayment(clientSecret: string) {
        return await this.stripe!.confirmCardPayment(clientSecret, {
            payment_method: {
                card: this.card,
                billing_details: {
                    name: 'Test User',
                },
            },
        });
    }
}
