import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AssignCourse } from '../../admin/models/assign-course';
import { AssignCourseService } from '../../admin/services/assign-course.service';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-upcoming-courses',
    standalone: true,
    imports: [RouterLink, CarouselModule, CommonModule],
    templateUrl: './upcoming-courses.component.html',
    styleUrl: './upcoming-courses.component.scss',
})
export class UpcomingCoursesComponent implements OnInit {
    assignCourse: AssignCourse[] = [];

    assignCourseService = inject(AssignCourseService);

    platFormService = inject(PlatformService);
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
    upcomingCoursesSlides: OwlOptions = {
        nav: true,
        loop: true,
        margin: 25,
        dots: false,
        autoplay: false,
        smartSpeed: 500,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-chevron-left'></i>",
            "<i class='fa-solid fa-chevron-right'></i>",
        ],
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 1,
            },
            695: {
                items: 2,
            },
            935: {
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };
}
