import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from "../../common/navbar/navbar.component";

@Component({
    selector: 'app-error-page',
    standalone: true,
    imports: [RouterLink, NavbarComponent, FooterComponent, BackToTopComponent],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {}