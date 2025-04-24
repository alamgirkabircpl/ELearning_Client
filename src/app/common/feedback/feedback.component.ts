import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [RouterLink, CarouselModule, NgIf, NgClass],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

	constructor (
        public router: Router
    ) {}

    feedbackSlides: OwlOptions = {
		items: 1,
		nav: false,
		loop: true,
		margin: 25,
		dots: true,
		autoplay: true,
		autoplayHoverPause: true,
		navText: [
			"<i class='fa-solid fa-chevron-left'></i>",
			"<i class='fa-solid fa-chevron-right'></i>"
		]
    }
    feedbackSlides2: OwlOptions = {
		items: 1,
		nav: true,
		loop: true,
		margin: 25,
		dots: false,
		autoplay: true,
		autoplayHoverPause: true,
		navText: [
			"<i class='fa-solid fa-arrow-left'></i>",
			"<i class='fa-solid fa-arrow-right'></i>"
		]
    }

}