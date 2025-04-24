import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { FunfactsComponent } from '../../common/funfacts/funfacts.component';
import { WhoWeAreComponent } from '../../common/who-we-are/who-we-are.component';
import { CoursesComponent } from '../../common/courses/courses.component';
import { PartnersComponent } from '../../common/partners/partners.component';
import { FeaturesComponent } from '../../common/features/features.component';
import { WhyUsComponent } from '../../common/why-us/why-us.component';
import { TeamComponent } from '../../common/team/team.component';
import { TestimonialsComponent } from '../../common/testimonials/testimonials.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { PricingComponent } from '../../common/pricing/pricing.component';
import { BlogComponent } from '../../common/blog/blog.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
    selector: 'app-home-demo-two',
    standalone: true,
    imports: [NavbarComponent, BannerComponent, FunfactsComponent, WhoWeAreComponent, CoursesComponent, PartnersComponent, FeaturesComponent, WhyUsComponent, TeamComponent, TestimonialsComponent, ContactComponent, PricingComponent, BlogComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-two.component.html',
    styleUrl: './home-demo-two.component.scss'
})
export class HomeDemoTwoComponent {}