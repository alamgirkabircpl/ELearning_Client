import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Instructor } from '../../admin/models/trainer';
import { InstructorService } from '../../admin/services/instructor.service';
import { ApiService } from '../../api.service';
import { PlatformService } from '../../platform.service';

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [RouterLink, NgClass, CommonModule],
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
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
