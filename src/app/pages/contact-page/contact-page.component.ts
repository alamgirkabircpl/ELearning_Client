import { Component } from '@angular/core';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from './page-banner/page-banner.component';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './contact-page.component.html',
    styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {}
