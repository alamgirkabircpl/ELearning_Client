import { Component } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { NavbarComponent } from "../../common/navbar/navbar.component";

@Component({
    selector: 'app-blog-page',
    standalone: true,
    imports: [RouterLink, NavbarComponent, PageBannerComponent, FeedbackComponent, FooterComponent, BackToTopComponent],
    templateUrl: './blog-page.component.html',
    styleUrl: './blog-page.component.scss'
})
export class BlogPageComponent {}