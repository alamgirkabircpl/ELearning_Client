import { Component } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { MoreBlogsComponent } from './more-blogs/more-blogs.component';
import { NavbarComponent } from "../../common/navbar/navbar.component";

@Component({
    selector: 'app-blog-details-page',
    standalone: true,
    imports: [RouterLink, NavbarComponent, PageBannerComponent, MoreBlogsComponent, FooterComponent, BackToTopComponent],
    templateUrl: './blog-details-page.component.html',
    styleUrl: './blog-details-page.component.scss'
})
export class BlogDetailsPageComponent {}