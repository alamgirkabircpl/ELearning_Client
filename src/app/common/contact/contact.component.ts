import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {

    constructor (
        public router: Router
    ) {}

}