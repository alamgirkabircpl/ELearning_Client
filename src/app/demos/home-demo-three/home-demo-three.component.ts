import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { MissionComponent } from '../../common/mission/mission.component';
import { CoursesComponent } from '../../common/courses/courses.component';
import { PartnersComponent } from '../../common/partners/partners.component';
import { WhyUsComponent } from '../../common/why-us/why-us.component';
import { CtaComponent } from '../../common/cta/cta.component';
import { TeamComponent } from '../../common/team/team.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { BlogComponent } from '../../common/blog/blog.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
    selector: 'app-home-demo-three',
    standalone: true,
    imports: [NavbarComponent, BannerComponent, MissionComponent, CoursesComponent, PartnersComponent, WhyUsComponent, CtaComponent, TeamComponent, ContactComponent, FeedbackComponent, BlogComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-three.component.html',
    styleUrl: './home-demo-three.component.scss'
})
export class HomeDemoThreeComponent {}