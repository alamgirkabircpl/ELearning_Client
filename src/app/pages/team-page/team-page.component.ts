import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from "../../common/navbar/navbar.component";

@Component({
    selector: 'app-team-page',
    standalone: true,
    imports: [RouterLink, NavbarComponent, PageBannerComponent, FooterComponent, BackToTopComponent],
    templateUrl: './team-page.component.html',
    styleUrl: './team-page.component.scss'
})
export class TeamPageComponent {}