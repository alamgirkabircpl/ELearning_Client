import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../admin/models/course';
import { CourseService } from '../../admin/services/course.service';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss',
})
export class FeaturesComponent {
    constructor(public router: Router, private sanitizer: DomSanitizer) {}

    // Toggle Class
    isActive1 = true; // First div is active by default
    isActive2 = false;
    isActive3 = false;

    courseService = inject(CourseService);
    platformService = inject(PlatformService);
    courses: Course[] = [];
    selectedCourse: any = null;
    isLoading: boolean = false;

    ngOnInit() {
        if (this.platformService.isBrowser()) {
            this.loadCourses();
        }
    }

    loadCourses() {
        this.courseService.getAll().subscribe((data) => {
            this.courses = data.data;
            console.log(this.courses);
        });
    }
    goToCourseDetails(courseId: number) {
        this.router.navigate(['/course-details'], {
            queryParams: { id: courseId },
        });
    }
    toggleClass(divNumber: number) {
        // Reset all divs to inactive
        this.isActive1 = false;
        this.isActive2 = false;
        this.isActive3 = false;
        // Set the clicked div as active
        if (divNumber === 1) {
            this.isActive1 = true;
        } else if (divNumber === 2) {
            this.isActive2 = true;
        } else if (divNumber === 3) {
            this.isActive3 = true;
        }
    }

    getSanitizedContent(html: string) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
