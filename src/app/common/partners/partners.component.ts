import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-partners',
    standalone: true,
    imports: [RouterLink, CarouselModule],
    templateUrl: './partners.component.html',
    styleUrl: './partners.component.scss'
})
export class PartnersComponent {

    partnersSlides: OwlOptions = {
		nav: false,
		loop: true,
		margin: 25,
		dots: false,
		autoplay: true,
		autoplayHoverPause: true,
		navText: [
			"<i class='fa-solid fa-chevron-left'></i>",
			"<i class='fa-solid fa-chevron-right'></i>"
		],
		responsive: {
			0: {
				items: 2
			},
			576: {
				items: 4
			},
			768: {
				items: 3
			},
			992: {
				items: 4
			},
			1200: {
				margin: 40,
				items: 4
			},
			1400: {
				margin: 40,
				items: 5
			},
			1600: {
				margin: 50,
				items: 6
			}
		}
    }

}