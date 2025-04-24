import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-why-us',
    standalone: true,
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './why-us.component.html',
    styleUrl: './why-us.component.scss'
})
export class WhyUsComponent {

    constructor (
        public router: Router
    ) {}

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

}