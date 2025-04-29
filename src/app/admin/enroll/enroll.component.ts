import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Enroll } from '../models/enroll';
import { EnrollService } from '../services/enroll.service';

@Component({
    selector: 'app-enroll',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './enroll.component.html',
    styleUrl: './enroll.component.scss',
})
export class EnrollComponent {
    enrollments: Enroll[] = [];
    filteredEnrollments: Enroll[] = [];

    pageNumber = 1;
    pageSize = 10;
    totalItems = 0;

    searchTerm = '';
    isApprovedFilter: string = ''; // "", "true", or "false"

    constructor(private enrollService: EnrollService) {}

    ngOnInit(): void {
        this.loadEnrollments();
    }

    loadEnrollments(): void {
        this.enrollService
            .getAll(this.pageNumber, this.pageSize)
            .subscribe((res) => {
                this.enrollments = res.data;
                this.totalItems = res.totalCount || res.data.length; // adjust based on backend
                this.applyFilters();
            });
    }

    applyFilters(): void {
        this.filteredEnrollments = this.enrollments.filter((item) => {
            const matchesSearch =
                !this.searchTerm ||
                item.id.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesApproval =
                this.isApprovedFilter === '' ||
                item.isApproved.toString() === this.isApprovedFilter;

            return matchesSearch && matchesApproval;
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    onPageChange(newPage: number): void {
        this.pageNumber = newPage;
        this.loadEnrollments();
    }

    edit(id: string): void {
        // navigate or open modal
        console.log('Edit ID:', id);
    }

    delete(id: string): void {
        if (confirm('Are you sure you want to delete this enrollment?')) {
            this.enrollService.delete(id).subscribe(() => {
                this.loadEnrollments();
            });
        }
    }

    get totalPages(): number[] {
        return Array.from(
            { length: Math.ceil(this.totalItems / this.pageSize) },
            (_, i) => i + 1
        );
    }
}
