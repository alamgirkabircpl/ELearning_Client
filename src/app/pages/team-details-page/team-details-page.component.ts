import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Instructor } from '../../admin/models/trainer';
import { InstructorService } from '../../admin/services/instructor.service';
import { UserService } from '../../admin/services/users.service';
import { ApiService } from '../../api.service';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PlatformService } from '../../platform.service';
import { CoursesAndInstructorPageComponent } from '../courses-page-instructor/courses-page-instructor.component';
import { PageBannerComponent } from './page-banner/page-banner.component';

@Component({
    selector: 'app-team-details-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        CommonModule,
        CoursesAndInstructorPageComponent,
    ],
    templateUrl: './team-details-page.component.html',
    styleUrl: './team-details-page.component.scss',
})
export class TeamDetailsPageComponent implements OnInit {
    instructor: Instructor | null = null;

    instructors: Instructor[] = [];
    instructorService = inject(InstructorService);
    platformService = inject(PlatformService);
    apiService = inject(ApiService);
    userService = inject(UserService);
    selectedInstructor: any = null;
    isLoading: boolean = false;
    instructorId: string = '';
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        if (this.platformService.isBrowser()) {
            const instructorId = this.route.snapshot.paramMap.get('id');
            console.log('Instructor ID:', instructorId);
            this.instructorId = instructorId || '';
            this.getInstructors();
            if (this.instructorId) {
                this.getInstructorById(this.instructorId);
            }
        }
    }

    getInstructors() {
        this.instructorService.getAll().subscribe({
            next: (data: any) => {
                console.log(data);
                this.instructors = data;
                console.log(this.instructors);
            },
            error: (err: any) =>
                console.error('Error loading instructors', err),
        });
    }
    getInstructorById(id: string) {
        this.instructorService.getById(id).subscribe((response) => {
            if (Array.isArray(response) && response.length > 0) {
                this.instructor = response[0]; // ✅ Safely extract first object
            }
        });
    }

    getImagePath(imageName: string): string {
        return this.apiService.getImageUrl(imageName);
    }
}
