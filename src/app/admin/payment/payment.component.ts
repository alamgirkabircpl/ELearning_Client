import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
    stripe!: Stripe | null;
    card!: StripeCardElement;

    constructor(private http: HttpClient) {}

    async ngOnInit() {
        this.stripe = await loadStripe(
            'pk_test_51PtN3qLo9zV8WUcX9DGaAqlvwYRsGPQyPDfp2EyOgP3AhjE9zaqvKbu6IOOzP0LI6MmQo6P2wimVKKsRquPAMrtB00R4lGfW9Q'
        );

        const elements = this.stripe!.elements();
        this.card = elements.create('card');
        this.card.mount('#card-element');
    }

    async pay(event: Event) {
        event.preventDefault();

        // Step 1: Ask backend for client secret
        const res: any = await this.http
            .post('http://localhost:44449/api/Payments/create-payment-intent', {
                amount: 49.99,
            })
            .toPromise();

        const result = await this.stripe!.confirmCardPayment(res.clientSecret, {
            payment_method: {
                card: this.card,
                billing_details: {
                    name: 'Test User',
                },
            },
        });

        if (result.error) {
            console.error('Payment failed:', result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
            console.log('💰 Payment successful!');
        }
    }
}
