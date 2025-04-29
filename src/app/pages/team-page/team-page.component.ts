import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Instructor } from '../../admin/models/trainer';
import { InstructorService } from '../../admin/services/instructor.service';
import { ApiService } from '../../api.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PlatformService } from '../../platform.service';
import { PageBannerComponent } from './page-banner/page-banner.component';

@Component({
    selector: 'app-team-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        CommonModule,
    ],
    templateUrl: './team-page.component.html',
    styleUrl: './team-page.component.scss',
})
export class TeamPageComponent {
    instructorService = inject(InstructorService);
    platformService = inject(PlatformService);
    instructors: Instructor[] = [];
    selectedInstructor: any = null;
    isLoading: boolean = false;
    private apiservice = inject(ApiService);
    constructor(public router: Router) {}
    ngOnInit() {
        if (this.platformService.isBrowser()) {
            this.loadInstructors();
        }
    }

    loadInstructors() {
        this.instructorService.getAll().subscribe({
            next: (data: any) => {
                console.log(data);
                this.instructors = data;
                console.log(this.instructors);
            },
            error: (err) => console.error('Error loading instructors', err),
        });
    }

    getImagePath(imageName: string): string {
        return this.apiservice.getImageUrl(imageName);
    }
}
