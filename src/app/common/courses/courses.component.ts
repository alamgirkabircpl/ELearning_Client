import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AssignCourse } from '../../admin/models/assign-course';
import { AssignCourseService } from '../../admin/services/assign-course.service';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [RouterLink, NgClass, CommonModule],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
    assignCourse: AssignCourse[] = [];

    assignCourseService = inject(AssignCourseService);

    platFormService = inject(PlatformService);
    router = inject(Router);
    constructor() {}
    ngOnInit(): void {
        if (this.platFormService.isBrowser()) {
            this.loadAssignCourse();
        }
    }

    loadAssignCourse() {
        this.assignCourseService.getAll().subscribe({
            next: (courses: any) => {
                this.assignCourse = courses;
            },
            error: (err) => console.error('Error loading courses', err),
        });
    }
}
