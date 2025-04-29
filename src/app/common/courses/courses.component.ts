import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AssignCourseService } from '../../admin/services/assign-course.service';
import { CommonService } from '../../admin/services/common.service';
import { ApiService } from '../../api.service';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [RouterLink, NgClass, CommonModule],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
    assignCourse: any[] = [];

    assignCourseService = inject(AssignCourseService);
    commonService = inject(CommonService);
    apiService = inject(ApiService);

    platFormService = inject(PlatformService);
    router = inject(Router);
    constructor() {}
    ngOnInit(): void {
        if (this.platFormService.isBrowser()) {
            this.loadAssignCourse();
        }
    }

    loadAssignCourse() {
        this.commonService.GetCourseAndInstructorDetails().subscribe({
            next: (courses: any) => {
                console.log('Courses:', courses);
                this.assignCourse = courses;
            },
            error: (err) => console.error('Error loading courses', err),
        });
    }

    getImageUrl(imagePath: string): string {
        return this.apiService.getImageUrl(imagePath);
    }
}
